<template>
  <div :style="meebidListItemClass" class="meebidListItemWrapper" @mouseover="mousehover(this)" @mouseout="mouseout(this)">
    <div class="meebidListItemContainer">
      <div>
        <div :style="imageWrapperStyle" class="meebidListItemImageWrapper">
          <img :style="imageStyle" :src="item.imageUrls[0]"></img>          
        </div>
        <div class="meebidListItemDescriptionWrapper" >
          <div class="meebidListItemDescriptionLabelWrapper">
            <p class="pinDescription" :title="item.name">{{item.name}}</p>
          </div>
          <div class="meebidListItemDescriptionIconWrapper">
            <span class="glyphicon glyphicon-heart"></span>
            <span>{{item.favor}}</span>
          </div>
          <div class="meebidListItemEstimationWrapper">
            <div>
              Est: {{getEsitmationPrice(item)}}
            </div>
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
        <meebid-button icon-type="save" button-type="orange" text="Watch">
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
  import meebidUtils from './../../utils/meebidUtils'
  export default {
    name: 'meebid-homepage-list-item',
    props: {
      viewType: {
        type: String,
        default: "waterfull"
      },
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
      },
      naturalWidth: {
        type: String,
        default: "0"
      },
      naturalHeight: {
        type: String,
        default: "0"
      }
    },
    data () {
      return {
        isMaskVisible: false
      }
    },
    computed: {
      imageWrapperStyle: function(){
        var calcHeight = 240 * this.naturalHeight/this.naturalWidth;
        return this.viewType === "waterfull" ? {
          height: calcHeight > 500 ? "500px" : calcHeight < 120 ? "120px" : calcHeight +"px",
        } : {
          height: "240px"
        };
      },
      imageStyle: function(){
        return this.viewType === "waterfull" ? {
          width: "240px",
          height: 240 * this.naturalHeight/this.naturalWidth + "px",
          margin: 0
        } : {
          width: this.naturalWidth >= this.naturalHeight ? "240px" : this.naturalWidth/this.naturalHeight * 240 + "px",
          height: this.naturalWidth < this.naturalHeight ? "240px" : this.naturalHeight/this.naturalWidth * 240 + "px",
          margin: this.naturalWidth >= this.naturalHeight ? (1 - this.naturalHeight/this.naturalWidth) * 120 + "px 0" : "0 " + (1 - this.naturalWidth/this.naturalHeight) * 120 + "px"
        };
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
      },
      getEsitmationPrice(item) {
        return meebidUtils.formatMoneyForNumberField(item.currencyCode, item.estMinPrice, true, 0, true) 
          + " - "
          + meebidUtils.formatMoneyForNumberField(item.currencyCode, item.estMaxPrice, true, 0, true);
      }
    }
  }
</script>

<style>

</style>
