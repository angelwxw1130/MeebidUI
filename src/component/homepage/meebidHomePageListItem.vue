<template>
  <div :style="meebidListItemClass" class="meebidListItemWrapper" @mouseover="mousehover(this)" @mouseout="mouseout(this)">
    <div class="meebidListItemContainer">
      <div>
        <div class="meebidListItemImageWrapper">
          <img :src="item.imageUrls[0]" style="width: 100%;"></img>          
        </div>
        <div class="meebidListItemDescriptionWrapper" >
          <div class="meebidListItemDescriptionLabelWrapper">
            <p class="pinDescription">{{item.name}}</p>
          </div>
          <div class="meebidListItemDescriptionIconWrapper">
            <span class="glyphicon glyphicon-star"></span>
            <span>{{item.favor}}</span>
          </div>
          <!--<div class="meebidListItemProviderWrapper">
            <div class="meebidListItemProviderImageWrapper">
              <img :src="avatarUrl" class="meebidListItemAvatarImage"></img>
            </div>
            <div class="meebidListItemProviderTextWrapper">
              <p class="meebidListItemProvider">{{imageProvider}}</p>
              <p class="meebidListItemName">{{imageName}}</p>
            </div>
          </div>-->
        </div>
      </div>
    </div>
    <div class="meebidListItemMask" v-show="isMaskVisible" @click="onLotClick">
      <div class="meebidListItemMaskShareButtonWrapper">
        <meebid-button icon-type="share" button-type="white">
        </meebid-button>
      </div>
      <div class="meebidListItemMaskSaveButtonWrapper">
        <meebid-button icon-type="save" button-type="orange" text="Save">
        </meebid-button>
      </div>
      <div class="meebidListItemMaskAuctionHouseNameWrapper" :style="{top: getTop4AuctionHouseName(item)}">
        <meebid-button button-type="white" :text="item.houseName" :button-click="onHouseClick">
        </meebid-button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'meebid-homepage-list-item',
    props: {
      height: {
        type: String,
        default: "0"
      },
      imageUrl: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      },
      favouriteCount: {
        type: String,
        default: null
      },
      avatarUrl: {
        type: String,
        default: null
      },
      imageName: {
        type: String,
        default: null
      },
      imageProvider: {
        type: String,
        default: null
      },
      meebidListItemClass: {
        type: Object,
        default: {}
      },
      item: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        isMaskVisible: false,
      }
    },
    methods: {
      mousehover() {
        this.isMaskVisible = true;
        // console.log("hover");
      },
      mouseout() {
        this.isMaskVisible = false;
        // console.log("out");
      },
      getTop4AuctionHouseName(item){
        var width = item.naturalWidth;
        var height = item.naturalHeight;
        var calculatedHeight = height * 240 / width; // 240 is default image width
        return ((calculatedHeight >= 500 ? 500 : (calculatedHeight <= 120 ? 120 : calculatedHeight)) - 40) + "px";
      },
      onHouseClick() {
        this.$emit('houseClick', this.item.houseId);
      },
      onLotClick() {
        this.$emit('lotClick', this.item.id);
      }
    }
  }
</script>

<style>

</style>
