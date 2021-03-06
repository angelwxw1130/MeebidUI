<template>
  <div>
    <div ref="meebidHomePageListScrollTag" class="meebidHomePageListScrollTag"></div>
    <div class="meebidHomePageListFilterContainer" v-if="isFilterActive" :class="{active: isFilterVisible}">
      <div class="meebidHomePageListFilterContainerHeaderBar">
        <meebid-switch class="meebidHomePageViewSwitcher" v-model="switchValue" :showHelpText="true" :helpTextSwitchOn="$t('meebid.lotList.MSG_SHOW_UPCOMING_LOTS')" :helpTextSwitchOff="$t('meebid.lotList.MSG_SHOW_PAST_LOTS')" @switchChange="switchChange"></meebid-switch>
        <div class="menu-trigger second" :class="{
          active: isFilterVisible
        }" @click="onFilterIconClick">
          <span class="line line-1"></span>
          <span class="line line-2"></span>
          <span class="line line-3"></span>
        </div>
      </div>
      <div class="meebidHomePageListFilterContent">
        <el-form ref="filterForm" :rules="filterFormRules" :model="filterForm" label-width="180px" class="meebidPaddingTopSmall">
          <el-col :span="12">
            <el-form-item label="Category" prop="category">
              <el-select v-model="filterForm.category" class="meebidFilterCategorySelect" multiple style="width:400px;" placeholder="Select..." @change="handleFilterSortChange">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <img class="meebidCategoryFilterImage" :class="{meebidMarginLeftSmall: item.upperLevel}" :src="item.imgUrl">
                  <span class="meebidPaddingLeftSmall">{{item.name}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sort" prop="sort">
              <el-select v-model="filterForm.sort" style="width:400px;" placeholder="Sort by..." @change="handleFilterSortChange">
                <el-option
                  v-for="item in sortOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </div>
    <div class="meebidHomePageList" :class="{meebidTileViewHomePageList: selectedView === 'tile', meebidHomePageListShowSwitch: showViewSwitch === true}" style="height: 1000px;">
      <div class="meebidHomePageListViewSwitcher">
        <span @click="onTileViewClick" class="glyphicon glyphicon-th-large meebidTileViewIcon meebidPaddingRightMedium"></span>
        <span @click="onWaterfullViewClick"  class="glyphicon glyphicon-stats meebidWaterfallViewIcon"></span>
      </div>
      <div ref="lotItemListContainer" class="meebidHomePageItemListContainer">
        <meebid-homepage-list-item v-for="item in visibleItems" :viewType="selectedView" :item="item" :key="item.id" :height="item.height" :image-url="item.imageUrl" :description="item.description" :favourite-count="item.favouriteCount" :meebid-list-item-class="item.meebidListItemClass" :naturalHeight="item.naturalHeight" :naturalWidth="item.naturalWidth" :avatar-url="item.avatarUrl" :image-name="item.imageName" :image-provider="item.imageProvider" @houseClick="onHouseClick" @lotClick="onLotClick"></meebid-homepage-list-item>
      </div>
      <div class="meebidNoResultText meebidPaddingTopMedium" v-if="noResult">No available lots, please adjust your filter</div>
      <div style="position: relative; width: 100%; height: 80px;" :style="{transform: busyIndicatorPosition}">
        <meebid-busy-indicator ref="lotListItemsBusyIndicator" :transparency="true" size="Medium"></meebid-busy-indicator>
      </div>
    </div>
  </div>
</template>

<script>
  import meebidHomePageListItem from './../homepage/meebidHomePageListItem.vue'
  import loginUtils from './../../utils/loginUtils'
  import meebidUtils from './../../utils/meebidUtils'
  import errorUtils from './../../utils/errorUtils'
  import i18n from './../../i18n/i18n'
  import $ from 'jquery'
  export default {
    name: 'meebid-homepage-list',
    props: {
      showViewSwitch: {
        type: Boolean,
        default: false
      },
      initializedKeyword: {
        type: String,
        default: ""
      },
      defaultSelectedCategory: {
        default: -1
      },
      searchType: {
        type: String,
        default: "all"
      },
      sceneId: -1,
      hideBusyIndicator: {
        type: Boolean,
        default: false
      },
      isFilterActive: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        switchValue: true,
        isFilterVisible: false,
        showUpcomingLot: true,
        selectedView: "waterfull",
        items: [],
        pendingItems: [],
        loginUser: loginUtils.getLoginUser(),
        currentPendingItem: {},
        visibleItems: [],
        lotPage: 1,
        lotPerPage: 20,
        windowWidth: 0,
        windowHeight: 0,
        currentTotal: 0,
        columnNum: 0,
        columnArr: [],
        isAdding: false,
        busyIndicatorPosition: "",
        inLoadingLotItems: false,
        dataLoadingNeeded: true,
        searchKeyword: "",
        lastRequest: {},
        noResult: false,
        filterForm: {},
        skippedPendingItem: [],
        filterFormRules: {},
        categoryOptions: [],
        sortOptions: [{
          id: 0,
          label: "Relevance"
        },{
          id: 1,
          label: "Price from High to Low"
        },{
          id: 2,
          label: "Price from Low to High"
        },{
          id: 3,
          label: "Newest Publish"
        }, {
          id: 4,
          label: "Most Awareness"
        }, {
          id: 5,
          label: "Sale Date Soonest"
        }]
      }
    },

    mounted() {
      var me = this;
      $.ajax({
        type: "GET",
        url: "/api/public/categorys",
        contentType : "application/json", 
        context: this,
        headers: {
        },
        success(data) {
          if (data.code === 1){
            me.buildCategoryOptions(data.content.categorys);
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Get Category failure',
              duration: 5000
            });
          }

        },
        error(data) {
          errorUtils.requestError(data);
        }
      })

      if (this.initializedKeyword){
        this.searchKeyword = this.initializedKeyword;
      }
      if (this.defaultSelectedCategory >= 0){
        this.filterForm.category = [this.defaultSelectedCategory];
      }
      window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('scroll', this.onWindwoScroll);
      //window.addEventListener('resize', this.getWindowHeight);

      //Init
      this.initWindowWidth();
      this.initColumn();
      
      var request = this.buildOnlineItemRequest();
      this.inLoadingLotItems = true;
      if (!this.hideBusyIndicator){
        this.$refs.lotListItemsBusyIndicator.show();
      }
      
      $.ajax(request);
      this.currentRequest = request;
    },
    methods: {
      buildCategoryOptions(categories){
        var categoryOptions = {};
        for (var i = 0; i < categories.length; i++){
          if (categories[i].upperLevel){
            var upperLevelObj = meebidUtils.findObject(categories, "id", categories[i].upperLevel);
            if (categoryOptions[categories[i].upperLevel]){
              categoryOptions[categories[i].upperLevel].options.push(categories[i]);
            } else {
              categoryOptions[categories[i].upperLevel] = upperLevelObj;
              categoryOptions[categories[i].upperLevel].options = [categories[i]];
            }
          } else {
            if (!categoryOptions[categories[i].id]){
              categoryOptions[categories[i].id] = categories[i];
              categoryOptions[categories[i].id].options = [];
            }
          }
        }
        for (var key in categoryOptions){
          var categoryObj = categoryOptions[key];
          if (categoryObj.options.length){
            this.categoryOptions.push(categoryObj);
            for (var j = 0; j < categoryObj.options.length; j++){
              this.categoryOptions.push(categoryObj.options[j]);
            }
          } else {
            this.categoryOptions.push(categoryObj)
          }
        }
      },
      buildOnlineItemRequest() {
        var me = this;
        var token = this.loginUser ? this.loginUser.token: null;
        this.noResult = false;
        var request = {   
          type : 'GET', 
          context: this, 
          traditional: true,
          success : function(data) {
            if (data.code == '1'){
              var items = this.buildLotItems(data.content.items ? data.content.items : []);
              this.lotPage++;
              this.currentRequest = null;
              this.currentTotal = data.content.total;
            } else {  
              this.$notify({
                title: 'Failure',
                message: 'Fetch Online Items failed',
                duration: 5000
              })
            }
            me.inLoadingLotItems = false; 
          },  
          error : function(data) {  
            errorUtils.requestError(data);
            me.inLoadingLotItems = false;
          },  
          dataType : 'json' 
        };
        if (this.searchKeyword){
          request.url = "/api/lot/search";
          request.data = {
            keyword: this.searchKeyword,
            offset: (this.lotPage - 1) * this.lotPerPage,
            count: this.lotPerPage
          };
        } else if (this.searchType === "all") {
          request.url = "/api/lot/list/online";
          request.data = {
            offset: (this.lotPage - 1) * this.lotPerPage,
            count: this.lotPerPage
          };
        } else if (this.searchType === 'auction'){
          request.url = "/api/scene/list/online";
          request.data = {
            offset: (this.lotPage - 1) * this.lotPerPage,
            sceneId: this.sceneId,
            count: this.lotPerPage
          };
        }
        request.data.old = !this.showUpcomingLot;
        if (this.isFilterActive){
          if (this.filterForm.category && this.filterForm.category.length){
            request.data.categorys = this.filterForm.category;
          }

          if (this.filterForm.sort >= 0){
            request.data.sortType = this.filterForm.sort;
          }
        }
        
        if (token){
          request.header = {
            token: token
          }
        }
        this.lastRequest = request;
        return request;
      },
      buildLotItems(items){
        var lotItems = [];
        for (var i = 0; i < items.length; i++){
          var item = items[i];
          var lotItem = {
            name: item.name,
            description: item.description,
            no: item.no,
            imageUrls: item.imageUrls.split(";"),
            isSold: item.isSold,
            id: item.id,
            favor: item.favor,
            sceneId: item.sceneId,
            estMaxPrice: item.estMaxPrice,
            estMinPrice: item.estMinPrice,
            category: item.category,
            currencyCode: item.currencyCode,
            houseId: item.houseId,
            reservePrice: item.reservePrice,
            startingBid: item.startingBid,
            houseName: item.houseName,
            sceneId: item.sceneId,
            meebidListItemClass: {}
          }
          lotItems.push(lotItem);
        }
        this.addItems(lotItems);
        if (this.items.length === 0){
          this.noResult = true;
        }
      },
      initColumn() {
        if (this.windowWidth >= 0 && this.windowWidth < 1040) {
          this.columnNum = 3;
        } else {
          this.columnNum = Math.floor(this.windowWidth / 260);
        }
        this.columnArr = [];
        for (var i = 0; i < this.columnNum; i++){
          this.columnArr.push(0);
        }
      },
      checkColumnNum() {
        var me = this;
        var columnNum;
        if (this.windowWidth >= 0 && this.windowWidth < 1040) {
          columnNum = 3;
        } else {
          columnNum = Math.floor(this.windowWidth / 260);
        }
        if (columnNum !== this.columnNum){
          this.columnNum = columnNum;
          this.columnArr = [];
          for (var i = 0; i < this.columnNum; i++){
            this.columnArr.push(0);
          }
          /*var newItems = [];
          if (this.items && this.items.length){
            for (var j = 0; j < this.items.length; j++){
              newItems.push(this.items[j]);
            }
          }
          this.pendingItems = newItems;
          this.visibleItems = [];
          this.$nextTick(function () {
            me.checkPendingItems();
          });*/
          this.refreshVisibleItems();
        }
      },
      cleanColumnArr() {
        this.columnArr = [];
        for (var i = 0; i < this.columnNum; i++){
          this.columnArr.push(0);
        }
      },
      resetColumnNum() {
        var me = this;
        var columnNum;
        if (this.windowWidth >= 0 && this.windowWidth < 1040) {
          columnNum = 3;
        } else {
          columnNum = Math.floor(this.windowWidth / 260);
        }
        this.columnNum = columnNum;
        this.columnArr = [];
        for (var i = 0; i < this.columnNum; i++){
          this.columnArr.push(0);
        }
      },
      initWindowWidth(){
        this.windowWidth = document.documentElement.clientWidth;
      },
      getWindowWidth(event) {
        this.windowWidth = document.documentElement.clientWidth;
        this.checkColumnNum();
      },
      //getWindowHeight(event) {
        //this.windowHeight = document.documentElement.clientHeight;
      //},
      getCurrentColumn() {
        var mininumHeight = this.columnArr[this.columnNum - 1];
        var mininumIdx = this.columnNum - 1;
        for (var i = this.columnNum - 2; i >= 0; i--){
          if (this.columnArr[i] <= mininumHeight) {
            mininumIdx = i;
            mininumHeight = this.columnArr[i];
          }
        }
        if (mininumIdx >= 0) {
          return mininumIdx;
        } else {
          return -1;
        }
        
      },
      refreshVisibleItems() {
        for (var i = 0; i < this.items.length; i++){
          var mininumIdx = this.getCurrentColumn();
          if (mininumIdx >= 0){
            this.items[i].meebidListItemClass = {
              transform: "translateX(" + mininumIdx * 260 + "px) translateY(" + this.columnArr[mininumIdx] + "px)"
            }
          } else {
            this.items[i].meebidListItemClass = {
              transform: "translateX(0px) translateY(0px)"
            }
          }
          this.columnArr[mininumIdx] += this.$refs.lotItemListContainer.childNodes[i].clientHeight;
        }
        
      },
      checkPendingItems() {
        var me = this;
        if (this.isAdding){
          return;
        } else if (this.pendingItems.length <= 0){
          if (this.currentTotal <= (this.lotPage - 1) * this.lotPerPage){
            //window.removeEventListener('scroll', this.onWindwoScroll);
            this.dataLoadingNeeded = false;
            this.$refs.lotListItemsBusyIndicator.hide();
          }
          return;
        }
        this.isAdding = true;
        var currentItem = this.pendingItems[0];
        var mininumIdx = this.getCurrentColumn();
        if (mininumIdx >= 0){
          currentItem.meebidListItemClass = {
            transform: "translateX(" + mininumIdx * 260 + "px) translateY(" + this.columnArr[mininumIdx] + "px)"
          }
        } else {
          currentItem.meebidListItemClass = {
            transform: "translateX(0px) translateY(0px)"
          }
        }

        let img = new Image();
        img.src = currentItem.imageUrls[0];
        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
          this.pendingItems.splice(0, 1);
          currentItem.naturalHeight = img.naturalHeight;
          currentItem.naturalWidth = img.naturalWidth;
          this.visibleItems.push(currentItem);
          this.$nextTick(function() {
            me.onItemImageLoaded();
          })
        } else {
          var checkCurrentLoading = function(){
            if (me.currentPendingItem){
              console.log("Skip lot item: " + me.currentPendingItem.name + ". Id is " + me.currentPendingItem.id);
              me.skippedPendingItem.push(me.currentPendingItem);
              me.pendingItems.splice(0, 1);
              me.isAdding = false;
              me.checkPendingItems();
            }
          };
          me.currentPendingItem = currentItem;
          img.onload = (image)=>{
            if (meebidUtils.findIndex(me.skippedPendingItem, "id", me.currentPendingItem.id) !== null){
              this.currentPendingItem = null;
              return;
            } else {
              clearTimeout(checkCurrentLoading);
              this.currentPendingItem = null;
              var imgEl = image.srcElement ? image.srcElement : image.target;
              this.pendingItems.splice(0, 1);
              currentItem.naturalHeight = imgEl.naturalHeight;
              currentItem.naturalWidth = imgEl.naturalWidth;
              this.visibleItems.push(currentItem);
              this.$nextTick(function() {
                me.onItemImageLoaded();
              })
            }
            
          };
          setTimeout(checkCurrentLoading, 10000);
        }        
      },
      onItemImageLoaded() {
        var mininumIdx = this.getCurrentColumn();
        var lastChild = this.$children[this.$children.length - 1];
        this.columnArr[mininumIdx] += lastChild.$el.clientHeight;
        console.log("item added");
        this.isAdding = false;
        this.adjustBusyIndicator();
        this.checkPendingItems();
      },
      adjustBusyIndicator() {
        var maxHeight = this.columnArr[0];
        var maxIdx = 0;
        for (var i = 1; i < this.columnArr.length; i++){
          if (this.columnArr[i] > maxHeight) {
            maxHeight = this.columnArr[i];
          }
        }
        this.busyIndicatorPosition = "translateY(" + (maxHeight + 10) + "px)";

      },
      addItem: function(itemComponent){
        this.items.push(itemComponent);
        this.pendingItems.push(itemComponent);
        this.checkPendingItems();
      },
      addItems: function(itemComponentArr){
        this.items = this.items.concat(itemComponentArr);
        this.pendingItems = this.pendingItems.concat(itemComponentArr);
        this.checkPendingItems();
      },
      clearItems() {
        this.items = [];
        this.pendingItems = [];
        this.visibleItems = [];
      },
      onWindwoScroll() {
        var me = this;
        if (!me.inLoadingLotItems && me.dataLoadingNeeded){
          var viewH = document.body.clientHeight,
              contentH = document.body.scrollHeight, 
              //to get the correct scrollTop in different browser
              scrollTop = window.pageYOffset
                  || document.documentElement.scrollTop
                  || document.body.scrollTop
                  || 0;
              //when remain space less than 80%, try to load next data.
          if((scrollTop + viewH)/contentH >= 0.8){
            me.inLoadingLotItems = true;
            var request = me.buildOnlineItemRequest();
            $.ajax(request);
            this.currentRequest = request;
          }  
        }
      },
      searchByKeyword(keyword){
        this.$refs.meebidHomePageListScrollTag.scrollIntoView(true);
        this.searchKeyword = keyword;
        if (this.currentRequest){
          this.currentRequest.abort();
          this.currentRequest = null;
        }
        this.clearItems();
        this.resetColumnNum();
        this.lotPage = 1;
        var request = this.buildOnlineItemRequest();
        //window.addEventListener('scroll', this.onWindwoScroll);
        this.dataLoadingNeeded = true;
        this.$refs.lotListItemsBusyIndicator.show();
        $.ajax(request);
        this.currentRequest = request;
      },
      onHouseClick(houseId){
        window.location.href = "./auctionHouseDetail.html?" + window.btoa("auctionHouseId=" + houseId);
      },
      onLotClick(lotId){
        console.log("Select Lot:" + lotId);
        window.location.href = "./lotDetail.html?" + window.btoa("lotId=" + lotId);
      },
      showBusyIndicator() {
        if (this.inLoadingLotItems) {
          this.$refs.lotListItemsBusyIndicator.show();
        }
      },
      onTileViewClick() {
        var me = this;
        this.selectedView = "tile";
        this.cleanColumnArr();
        this.$nextTick(function () {
          setTimeout(function(){
            me.refreshVisibleItems();
          }, 500)
          
        });
      },
      onWaterfullViewClick() {
        var me = this;
        this.selectedView = "waterfull";
        this.cleanColumnArr();
        this.$nextTick(function () {
          setTimeout(function(){
            me.refreshVisibleItems();
          }, 500)
        });
      },
      switchChange(switchValue){
        this.showUpcomingLot = switchValue;
        this.refreshSearchRequest();
      },
      onFilterIconClick() {
        this.isFilterVisible = !this.isFilterVisible;
      },
      refreshSearchRequest() {
        this.$refs.meebidHomePageListScrollTag.scrollIntoView(true);
        this.clearItems();
        this.resetColumnNum();
        this.lotPage = 1;
        var request = this.buildOnlineItemRequest();
        this.dataLoadingNeeded = true;
        this.inLoadingLotItems = true;
        if (!this.hideBusyIndicator){
          this.$refs.lotListItemsBusyIndicator.show();
        }
        $.ajax(request);
        this.currentRequest = request;
      },
      handleFilterSortChange() {
        if (this.pendingFilterSortChangeTrigger){
          clearTimeout(this.pendingFilterSortChangeTrigger);
        }
        var me = this;
        this.pendingFilterSortChangeTrigger = setTimeout(function(){
          me.refreshSearchRequest();
        }, 500);
      },
      setFilterCategory(category){
        this.filterForm.category = [category];
        this.isFilterVisible = true;
        this.refreshSearchRequest();
      },
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.getWindowWidth);
      window.removeEventListener('scroll', this.onWindwoScroll);
      //window.removeEventListener('resize', this.getWindowHeight);
    }
  }
</script>

<style>
  .menu-trigger.second {
    transition: all 0.5s 0s;
  }

  .menu-trigger.second.active {
    transform: rotate(135deg);
    transition: all 0.5s 0.3s;
  }
  .menu-trigger {
    width: 25px;
    height: 20px;
    position: relative;
    cursor: pointer;
    display: inline-block;
    left: calc(100%);
  }

  .menu-trigger.second.active .line {
    background: #000;
  }

  .menu-trigger.second .line {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 2px;
    background: #000;
    transition: 0.3s;
  }
  .menu-trigger .line {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #000;
    height: 2px;
  }
  .menu-trigger.second .line.line-1 {
    transition: all 0.3s 0.3s, transform 0.3s 0s;
  }
  .menu-trigger.second.active .line-1 {
    top: 50%;
    margin-top: -1px;
    transform: rotate(90deg);
    transition: all 0.3s, transform 0.3s 0.3s;
  }
  .menu-trigger.second .line.line-2 {
    top: 50%;
    margin-top: -1px;
    left: 0;
    transition: all 0.3s 0.3s;
  }
  .menu-trigger.second.active .line-2 {
    opacity: 0;
    transition: all 0.3s, opacity 0.3s 0s;
  }
  .menu-trigger.second .line.line-3 {
    bottom: 0;
    top: auto;
    left: 0;
    transition: all 0.3s 0.3s, transform 0.3s 0s;
  }
  .menu-trigger.second.active .line-3 {
    bottom: 50%;
    margin-bottom: -1px;
    transform: rotate(0deg);
    transition: all 0.3s, transform 0.3s 0.3s;
  }  

</style>
