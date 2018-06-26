<template>
  <div ref="lotItemListContainer" class="meebidHomePageList" style="height: 1000px;">
    <meebid-homepage-list-item v-for="item in visibleItems" :key="item.id" :height="item.height" :image-url="item.imageUrl" :description="item.description" :favourite-count="item.favouriteCount" :meebid-list-item-class="item.meebidListItemClass" :avatar-url="item.avatarUrl" :image-name="item.imageName" :image-provider="item.imageProvider" @imageCompleted="onItemImageLoaded"></meebid-homepage-list-item>
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
      }
    },

    mounted() {
      console.log("page list ready");
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);
        window.addEventListener('resize', this.getWindowHeight);

        //Init
        this.getWindowWidth();
        this.getWindowHeight();
        this.initColumn();
      })
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
      getWindowWidth(event) {
        this.windowWidth = document.documentElement.clientWidth;
        this.checkColumnNum();
      },
      getWindowHeight(event) {
        this.windowHeight = document.documentElement.clientHeight;
      },
      getCurrentColumn() {
        var mininumHeight = this.columnArr[this.columnNum - 1];
        var mininumIdx = this.columnNum - 1;
        for (var i = this.columnNum - 2; i >= 0; i--){
          if (this.columnArr[i] <= mininumHeight) {
            mininumIdx = i;
            mininumHeight = this.columnArr[i];
          }
        }
        return mininumIdx;
      },
      checkPendingItems() {
        var me = this;
        if (this.pendingItems.length <= 0 || this.isAdding){
          return;
        }
        this.isAdding = true;
        var currentItem = this.pendingItems[0];
        var mininumIdx = this.getCurrentColumn();
        currentItem.meebidListItemClass = {
          transform: "translateX(" + mininumIdx * 260 + "px) translateY(" + this.columnArr[mininumIdx] + "px)"
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
        this.checkPendingItems();
      },
      addItem: function(itemComponent){
        this.items.push(itemComponent);
        this.pendingItems.push(itemComponent);
        this.checkPendingItems();
      },
      addItems: function(itemComponentArr){
        this.items.concat(itemComponentArr);
        this.pendingItems.concat(itemComponent);
        this.checkPendingItems();
      },
      clearItems() {
        this.items = [];
        this.pendingItems = [];
        this.visibleItems = [];
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.getWindowWidth);
      window.removeEventListener('resize', this.getWindowHeight);
    }
  }
</script>

<style>

</style>
