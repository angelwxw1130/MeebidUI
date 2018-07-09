<template>
  <div ref="lotItemListContainer" class="meebidHomePageList" style="height: 1000px;">
    <meebid-homepage-list-item v-for="item in visibleItems" :item="item" :key="item.id" :height="item.height" :image-url="item.imageUrl" :description="item.description" :favourite-count="item.favouriteCount" :meebid-list-item-class="item.meebidListItemClass" :avatar-url="item.avatarUrl" :image-name="item.imageName" :image-provider="item.imageProvider" @imageCompleted="onItemImageLoaded"></meebid-homepage-list-item>
    <div v-if="noResult">No Lots</div>
    <div style="position: relative; width: 100%; height: 80px;" :style="{transform: busyIndicatorPosition}">
      <meebid-busy-indicator ref="lotListItemsBusyIndicator" transparency="true" size="Medium"></meebid-busy-indicator>
    </div>
  </div>
</template>

<script>
  import meebidHomePageListItem from './../homepage/meebidHomePageListItem.vue'
  import loginUtils from './../../utils/loginUtils'
  import errorUtils from './../../utils/errorUtils'
  import $ from 'jquery'
  export default {
    name: 'meebid-homepage-list',
    data() {
      return {
        items: [],
        pendingItems: [],
        loginUser: loginUtils.getLoginUser(),
        visibleItems: [],
        lotPage: 1,
        lotPerPage: 20,
        windowWidth: 0,
        windowHeight: 0,
        columnNum: 0,
        columnArr: [],
        isAdding: false,
        busyIndicatorPosition: "",
        inLoadingLotItems: false,
        searchKeyword: "",
        noResult: false
      }
    },

    mounted() {
      window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('scroll', this.onWindwoScroll);
      //window.addEventListener('resize', this.getWindowHeight);

      //Init
      this.initWindowWidth();
      this.initColumn();
      
      var request = this.buildOnlineItemRequest();
      this.inLoadingLotItems = true;
      this.$refs.lotListItemsBusyIndicator.show();
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
              var items = this.buildLotItems(data.content.items ? data.content.items : []);
              this.lotPage++;
              this.currentRequest = null;
              if (data.content.total <= (this.lotPage - 1) * this.lotPerPage){
                window.removeEventListener('scroll', this.onWindwoScroll);
                this.$refs.lotListItemsBusyIndicator.hide();
              }
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
        } else {
          request.url = "/api/lot/list/online";
          request.data = {
            offset: (this.lotPage - 1) * this.lotPerPage,
            count: this.lotPerPage
          };
        }
        
        if (token){
          request.header = {
            token: token
          }
        }
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
            sceneId: item.sceneId
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
          var newItems = [];
          if (this.items && this.items.length){
            for (var j = 0; j < this.items.length; j++){
              newItems.push(this.items[j]);
            }
          }
          this.pendingItems = newItems;
          this.visibleItems = [];
          this.$nextTick(function () {
            me.checkPendingItems();
          });
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
      checkPendingItems() {
        var me = this;
        if (this.pendingItems.length <= 0 || this.isAdding){
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
          img.onload = (image)=>{
            this.pendingItems.splice(0, 1);
            currentItem.naturalHeight = image.naturalHeight;
            currentItem.naturalWidth = image.naturalWidth;
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
        if (!me.inLoadingLotItems){
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
        this.searchKeyword = keyword;
        if (this.currentRequest){
          this.currentRequest.abort();
          this.currentRequest = null;
        }
        this.clearItems();
        this.resetColumnNum();
        this.lotPage = 1;
        var request = this.buildOnlineItemRequest();
        window.addEventListener('scroll', this.onWindwoScroll);
        this.$refs.lotListItemsBusyIndicator.show();
        $.ajax(request);
        this.currentRequest = request;
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
