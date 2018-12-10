<template>
  <div class="col-md-12 meebidHousePageListItemBorder" style="border-top: 1px solid #ccc;padding: 20px 0;vertical-align: middle;">
   <div class="col-md-12" style="display: flex;flex-direction: row;flex-wrap: nowrap;align-items: center;justify-content: center;">
    <div class="col-md-3" style="vertical-align: middle;">
        <div :style="imageWrapperStyle" class="meebidListItemImageWrapper">
          <img :style="imageStyle" :src="item.imageUrls"></img>          
        </div>
    </div>
    <div class="col-md-3" style="vertical-align: middle;">
        <p class="pinDescription" style="font-size:18px;width:400px;">{{getDate(item.startAt, null)}}</p>
    </div>
    <div class="col-md-5" style="vertical-align: middle;">
        <div class="meebidListItemDescriptionLabelWrapper">
            <p class="auctionNameDescription" :title="item.name" style="font-size:18px;">{{item.name}}</p>
        </div>   
    </div>
    <div class="col-md-2" style="vertical-align: middle;">
        <meebid-button wrapper-cls="homeWrapper" button-type="round orange" text="Browse" :button-click="onAuctionClick" >
        </meebid-button>
    </div>
   </div>
  
   
  </div>
</template>

<script>
  import meebidUtils from './../../utils/meebidUtils'
  import i18n from './../../i18n/i18n'
  export default {
    name: 'meebid-housepage-list-item',
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
      onAuctionClick() {
        this.$emit('auctionClick', this.item.id);
      },
      onLotClick() {
        this.$emit('lotClick', this.item.id);
      },
      getDate(date, sceneEx){
      if (date){
        var dateStr = meebidUtils.formatDate(date, i18n.t('meebid.common.MSG_DATE_TIME_DETAIL_FORMAT'));
        if (sceneEx && sceneEx.timeZone !== null){
          var timeZoneStr = window.meebidConstant.regionTimeZone[sceneEx.timeZone + ""];
          if (timeZoneStr){
            dateStr += " " + timeZoneStr;
          } else {
            dateStr += " UTC " + sceneEx.timeZone + ":00 " + i18n.t('meebid.common.MSG_HOURS');
          }
        }
        console.log(dateStr);
        return dateStr;
      } else {
        return "";
      }
    }
      /* 
      getEsitmationPrice(item) {
        return meebidUtils.formatMoneyForNumberField(item.currencyCode, item.estMinPrice, true, 0, true) 
          + " - "
          + meebidUtils.formatMoneyForNumberField(item.currencyCode, item.estMaxPrice, true, 0, true);
      }
      */
    }
  }
</script>

<style>

</style>
