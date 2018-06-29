<template>
  <div ref="lotItemListContainer" class="meebidHomePageList" style="height: 1000px;">
    <meebid-homepage-list-item v-for="item in visibleItems" :key="item.id" :height="item.height" :image-url="item.imageUrl" :description="item.description" :favourite-count="item.favouriteCount" :meebid-list-item-class="item.meebidListItemClass" :avatar-url="item.avatarUrl" :image-name="item.imageName" :image-provider="item.imageProvider" @imageCompleted="onItemImageLoaded"></meebid-homepage-list-item>
    <div style="position: relative; width: 100%; height: 80px;" :style="{transform: busyIndicatorPosition}">
      <meebid-busy-indicator ref="lotListItemsBusyIndicator" transparency="true" size="Medium"></meebid-busy-indicator>
    </div>
  </div>
</template>

<script>
  import meebidHomePageListItem from './../homepage/meebidHomePageListItem.vue'
  export default {
    name: 'meebid-homepage-list',
    data() {
      return {
        items: [],
        pendingItems: [],
        visibleItems: [],
        windowWidth: 0,
        windowHeight: 0,
        columnNum: 0,
        columnArr: [],
        isAdding: false,
        busyIndicatorPosition: "",
        inLoadingLotItems: false
      }
    },

    mounted() {
      console.log("page list ready");
      window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('scroll', this.onWindwoScroll);
      //window.addEventListener('resize', this.getWindowHeight);

      //Init
      this.$refs.lotListItemsBusyIndicator.show();
      this.initWindowWidth();
      this.initColumn();
    },
    methods: {
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
        img.src = currentItem.imageUrl;
        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
          this.pendingItems.splice(0, 1);
          this.visibleItems.push(currentItem);
          this.$nextTick(function() {
            me.onItemImageLoaded();
          })
        } else {
          img.onload = ()=>{
            this.pendingItems.splice(0, 1);
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
            setTimeout(function(){
              me.addTestItems();
              me.inLoadingLotItems = false;
            }, 3000);
          }  
        }
      },
      addTestItems() {
        this.addItems([{
          height: "",
          imageUrl: "./../static/clock1.jpg",
          avatarUrl: "./../static/user1.jpg",
          imageProvider: "Carrie Beth",
          imageName: "The big day ❤️",
          description: "Vintage French Clock | home antique clocks antique french…",
          favouriteCount: "729",
          meebidListItemClass: {}
        }, {
          height: "",
          imageUrl: "./../static/clock2.jpg",
          avatarUrl: "./../static/user2.jpg",
          imageProvider: "Here should be Auction",
          imageName: "Auction Item Name",
          description: ".would love to know the orgin of this pic. i bet our resto…",
          favouriteCount: "4.3k",
          meebidListItemClass: {}
        }, {
          height: "",
          imageUrl: "./../static/clock3.jpg",
          avatarUrl: "./../static/user3.jpg",
          imageProvider: "Melinda Earll",
          imageName: "antique French clocks",
          description: "French Porcelain Mounted Ormolu Calendar Mantel Clock by…",
          favouriteCount: "221",
          meebidListItemClass: {}
        }, {
          height: "",
          imageUrl: "./../static/clock4.jpg",
          avatarUrl: "./../static/user4.jpg",
          imageProvider: "Charlene Clouser",
          imageName: "Time pieces",
          description: "Late 18TH CENTURY FRENCH EMPIRE ORMOLU MANTEL CLOCK the dial…",
          favouriteCount: "84",
          meebidListItemClass: {}
        }, {
          height: "",
          imageUrl: "./../static/clock5.jpg",
          avatarUrl: "./../static/user5.jpg",
          imageProvider: "Catheryne Tope",
          imageName: "Baroque Tall Case Clock",
          description: "French Clock from the Baroque Period. This type of clock was…",
          favouriteCount: "513",
          meebidListItemClass: {}
        }, {
          height: "",
          imageUrl: "./../static/clock6.jpg",
          avatarUrl: "./../static/user6.jpg",
          imageProvider: "Gaia Semerdjyan",
          imageName: "Clocks",
          description: "Eighteenth-Century French Clocks | The Frick Collection",
          favouriteCount: "22",
          meebidListItemClass: {}
        }, {
          height: "",
          imageUrl: "./../static/clock7.jpg",
          avatarUrl: "./../static/user7.jpg",
          imageProvider: "Garrett Bay",
          imageName: "projects",
          description: "Beautiful antique gilt figural clock.",
          favouriteCount: "813",
          meebidListItemClass: {}
        }, {
          height: "",
          imageUrl: "./../static/clock8.jpg",
          avatarUrl: "./../static/user8.jpg",
          imageProvider: "Belinda Vernon",
          imageName: "Victorian",
          description: "AN UNUSUAL 19TH CENTURY FRENCH CHAMPLEVE ENAMEL BRONZE…",
          favouriteCount: "164",
          meebidListItemClass: {}
        }, {
          height: "",
          imageUrl: "./../static/clock9.jpg",
          avatarUrl: "./../static/user9.jpg",
          imageProvider: "Ed Clarke",
          imageName: "Lara's Design Inspiration",
          description: "Antique clock French 1800. A modern equivalent would look…",
          favouriteCount: "2.7k",
          meebidListItemClass: {}
        }]);
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
