<template>
  <div class="meebidHomePageList" :class="{meebidTileViewHomePageList: selectedView === 'tile', meebidHomePageListShowSwitch: showViewSwitch === true}" style="height: 1000px;">
    <div ref="meebidHomePageListScrollTag" class="meebidHomePageListScrollTag"></div>
    <div class="meebidHomePageListViewSwitcher">
      <span @click="onTileViewClick" class="glyphicon glyphicon-th-large meebidTileViewIcon meebidPaddingRightMedium"></span>
      <span @click="onWaterfullViewClick"  class="glyphicon glyphicon-stats meebidWaterfallViewIcon"></span>
    </div>
    <div ref="auctionItemListContainer" class="meebidHomePageItemListContainer">
      <meebid-housepage-list-item v-for="item in visibleItems" :viewType="selectedView" :item="item" :key="item.id" :height="item.height" :image-url="item.imageUrl" :meebid-list-item-class="item.meebidListItemClass" :naturalHeight="item.naturalHeight" :naturalWidth="item.naturalWidth" :avatar-url="item.avatarUrl" :image-provider="item.imageProvider" @auctionClick="onAuctionClick"></meebid-housepage-list-item>
    </div>
    <div v-if="noResult">No Auctions</div>
    <div style="position: relative; width: 100%; height: 80px;" :style="{transform: busyIndicatorPosition}">
      <meebid-busy-indicator ref="auctionListItemsBusyIndicator" transparency="true" size="Medium"></meebid-busy-indicator>
    </div>
  </div>
</template>

<script>
  import meebidHousePageListItem from './../housepage/meebidHousePageListItem.vue'
  import loginUtils from './../../utils/loginUtils'
  import errorUtils from './../../utils/errorUtils'
  import $ from 'jquery'
  export default {
    name: 'meebid-housepage-list',
    props: {
      showViewSwitch: {
        type: Boolean,
        default: false
      },
      initializedKeyword: {
        type: String,
        default: ""
      },
      searchType: {
        type: String,
        default: "all"
      },
      houseId: -1,
      hideBusyIndicator: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectedView: "waterfull",
        items: [],
        pendingItems: [],
        loginUser: loginUtils.getLoginUser(),
        visibleItems: [],
        auctionPage: 1,
        auctionPerPage: 20,
        windowWidth: 0,
        windowHeight: 0,
        currentTotal: 0,
        columnNum: 0,
        columnArr: [],
        isAdding: false,
        busyIndicatorPosition: "",
        inLoadingAuctionItems: false,
        searchKeyword: "",
        noResult: false
      }
    },

    mounted() {
      if (this.initializedKeyword){
        this.searchKeyword = this.initializedKeyword;
      }
      window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('scroll', this.onWindwoScroll);
      //window.addEventListener('resize', this.getWindowHeight);

      //Init
      this.initWindowWidth();
      this.initColumn();
      
      var request = this.buildOnlineItemRequest();
      this.inLoadingAuctionItems = true;
      if (!this.hideBusyIndicator){
        this.$refs.auctionListItemsBusyIndicator.show();
      }
      
      $.ajax(request);
      this.currentRequest = request;
    },
    methods: {
      buildOnlineItemRequest() {
        var me = this;
        var token = this.loginUser ? this.loginUser.token: null;
        this.noResult = false;
        var request = {   
          type : 'GET', 
          context: this, 
          success : function(data) {
            if (data.code == '1'){
              var items = this.buildAuctionItems(data.content.items ? data.content.items : []);
              this.auctionPage++;
              this.currentRequest = null;
              this.currentTotal = data.content.total;
            } else {  
              this.$notify({
                title: 'Failure',
                message: 'Fetch Online Items failed',
                duration: 5000
              })
            }
            me.inLoadingAuctionItems = false; 
          },  
          error : function(data) {  
            errorUtils.requestError(data);
            me.inLoadingAuctionItems = false;
          },  
          dataType : 'json' 
        };
        if (this.searchKeyword){
          request.url = "/api/lot/search";
          request.data = {
            keyword: this.searchKeyword,
            offset: (this.auctionPage - 1) * this.auctionPerPage,
            count: this.auctionPerPage
          };
        }else if (this.searchType === 'auctionHouseOnline'){
          request.url = "/api/scene/online";
          request.data = {
            offset: (this.auctionPage - 1) * this.auctionPerPage,
            houseId: this.houseId,
            count: this.auctionPerPage
          };
        }else if (this.searchType === 'auctionHouseExpire'){
          request.url = "/api/scene/expire";
          request.data = {
            offset: (this.auctionPage - 1) * this.auctionPerPage,
            houseId: this.houseId,
            count: this.auctionPerPage
          };
        }
        
        if (token){
          request.header = {
            token: token
          }
        }
        return request;
      },
      buildAuctionItems(items){
        var auctionItems = [];
        for (var i = 0; i < items.length; i++){
          var item = items[i];
          var auctionItem = {
            name: item.name,
            description: item.description,
            no: item.no,
            imageUrls: item.logo,
            //isSold: item.isSold,
            id: item.id,
            //favor: item.favor,
            houseId: item.houseId,
            //estMaxPrice: item.estMaxPrice,
            //estMinPrice: item.estMinPrice,
            //category: item.category,
            //currencyCode: item.currencyCode,
            //houseId: item.houseId,
            //reservePrice: item.reservePrice,
            //startingBid: item.startingBid,
            //houseName: item.houseName,
            //houseId: item.houseId,
            meebidListItemClass: {}
          }
          auctionItems.push(auctionItem);
        }
        this.addItems(auctionItems);
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
          this.columnArr[mininumIdx] += this.$refs.auctionItemListContainer.childNodes[i].clientHeight;
        }
        
      },
      checkPendingItems() {
        var me = this;
        if (this.isAdding){
          return;
        } else if (this.pendingItems.length <= 0){
          if (this.currentTotal <= (this.auctionPage - 1) * this.auctionPerPage){
            window.removeEventListener('scroll', this.onWindwoScroll);
            this.$refs.auctionListItemsBusyIndicator.hide();
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
        img.src = currentItem.imageUrls;
        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
          this.pendingItems.splice(0, 1);
          currentItem.naturalHeight = img.naturalHeight;
          currentItem.naturalWidth = img.naturalWidth;
          this.visibleItems.push(currentItem);
          this.$nextTick(function() {
            me.onItemImageLoaded();
          })
        } else {
          img.onload = (image)=>{
            var imgEl = image.srcElement ? image.srcElement : image.target;;
            this.pendingItems.splice(0, 1);
            currentItem.naturalHeight = imgEl.naturalHeight;
            currentItem.naturalWidth = imgEl.naturalWidth;
            this.visibleItems.push(currentItem);
            this.$nextTick(function() {
              me.onItemImageLoaded();
            })
          };
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
        if (!me.inLoadingAuctionItems){
          var viewH = document.body.clientHeight,
              contentH = document.body.scrollHeight, 
              //to get the correct scrollTop in different browser
              scrollTop = window.pageYOffset
                  || document.documentElement.scrollTop
                  || document.body.scrollTop
                  || 0;
              //when remain space less than 80%, try to load next data.
          if((scrollTop + viewH)/contentH >= 0.8){
            me.inLoadingAuctionItems = true;
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
        this.auctionPage = 1;
        var request = this.buildOnlineItemRequest();
        window.addEventListener('scroll', this.onWindwoScroll);
        this.$refs.auctionListItemsBusyIndicator.show();
        $.ajax(request);
        this.currentRequest = request;
      },
      onAuctionClick(sceneId){
         window.location.href = "./auctionDetail.html?" + window.btoa("auctionId=" + sceneId); 
      },
      showBusyIndicator() {
        if (this.inLoadingAuctionItems) {
          this.$refs.auctionListItemsBusyIndicator.show();
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
      changeViewItem(switchValue){
        if(switchValue){
          this.searchType = "auctionHouseOnline";      
          console.log("changeViewItem " + this.searchType);  
          
        }else{
          this.searchType = "auctionHouseExpire"; 
          console.log("changeViewItem " + this.searchType);  
        }
        this.auctionPage = 1;
        this.clearItems();

        this.initWindowWidth();
        this.initColumn();
        var request = this.buildOnlineItemRequest();
        this.inLoadingAuctionItems = true;
        if (!this.hideBusyIndicator){
          this.$refs.auctionListItemsBusyIndicator.show();
        }
        
        $.ajax(request);
        this.currentRequest = request;
        this.refreshVisibleItems();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.getWindowWidth);
      window.removeEventListener('scroll', this.onWindwoScroll);
      //window.removeEventListener('resize', this.getWindowHeight);
    }
  }
</script>

<style>

</style>
