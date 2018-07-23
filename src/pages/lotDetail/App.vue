<template>
  <div id="app" class="meebidHomePage meebid" :style="{minHeight: windowMinHeight}">
    <meebid-header :first-name="firstName" :profile-tooltip-visible="profileTooltipVisible" :profile-tooltip-disabled="profileTooltipDisabled" @search="onSearch">
    </meebid-header>
    <div id="content" class="meebidContent meebidLotDetailContent">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <meebid-breadcrumb-item v-for="breadItem in breadItems" :redirectUrl="{ path: breadItem.path }">{{breadItem.label}}</meebid-breadcrumb-item>
      </el-breadcrumb>
      <div class="meebidLotDetailCarouselContainer">
        <meebid-carousel type="card" indicator-type="image" indicator-position="outside" :autoplay="false">
          <el-carousel-item v-for="item in lotItem.imageUrls" :label="item">
            <div class="meebidLotDetailImageContainer">
              <img :src="item"></img>          
            </div>
          </el-carousel-item>
        </meebid-carousel>
      </div>
      <div class="meebidLotDetailInformationContainer meebidPaddingLeftMedium">
        <div class="meebidLotDetailDescriptionContainer">
          <div class="meebidLotDetailDescriptionNameContainer">
            <span>Lot {{lotItem.no}}: {{lotItem.name}}</span>
          </div>
          <div class="meebidLotDetailDescriptionEstPriceContainer meebidMarginTopMedium meebidMarginBottomSmall">
            <span>Estimation:</span>
            {{getEsitmationPrice(lotItem)}}
          </div>
          <div class="meebidLotDetailDescriptionStartBidPriceContainer meebidMarginBottomMedium">
            {{getStartPrice(lotItem)}}
          </div>
          <div class="meebidLotDetailDescriptionAuctionTimeContainer meebidPaddingTopMedium">
            <span>{{getDate(lotItem.auctionAt)}}</span>
          </div>
          <div v-if="isBiddingAddressVisible(lotItem)" class="meebidLotDetailDescriptionAuctionLocationContainer meebidPaddingTopSmall">
            <span>{{getAddress(lotItem.sceneEx)}}</span>
          </div>
          <div class="meebidLotDetailDescriptionAuctionTypeContainer meebidPaddingTopSmall">
            <span>{{getAuctionType(lotItem.sceneEx)}}</span>
          </div>
        </div>
      </div> 
    </div>
    
    <meebid-login-dialog>
    </meebid-login-dialog>
    <meebid-busy-indicator ref="busyIndicator" size="Medium"></meebid-busy-indicator>
  </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import meebidUtils from './../../utils/meebidUtils'
import i18n from './../../i18n/i18n'
import $ from 'jquery'
export default {
  props: {
    profileData: Object
  },
  data () {
    return {
      profileTooltipVisible: false,
      profileTooltipDisabled: true,
      loginUser: loginUtils.getLoginUser(),
      userProfile: {
      },
      firstName: "User",
      loginDialogVisible: false,
      loginForm: {
        email: "",
        password: ""
      },
      loginFormRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' }          
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' }    
        ],
      },
      windowMinHeight: 0,
      categoryItems: [],
      lotItem: {
        imageUrls: []
      },
      breadItems: [{
        path: window.location.origin + "/home.html",
        label: "Home"
      }]
    }
  },
  beforeMount() {
    console.log("app ready");
    if (this.$parent.$data && this.$parent.$data.user){
      this.userProfile = this.$parent.$data.user;
      if (this.userProfile.type === window.meebidConstant.userType.member){
        if (this.userProfile.firstName){
          this.firstName = this.userProfile.firstName;
        }
        this.userProfileForm = this.userProfile;

      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;
        }
      }
    }
    var categoryItems = this.$parent.$data.categories;
    this.categoryItems = categoryItems;
  },
  mounted(){
    var paramsString = window.location.search;
    paramsString = paramsString.substring(1);
    var decodeData = window.atob(paramsString);
    var lotId = meebidUtils.getQueryString(decodeData, "lotId");
    console.log("Lot Id: " + lotId);
    this.windowMinHeight = window.innerHeight - 85 + "px";
    this.$refs.busyIndicator.show();
    $.ajax({
      type: "GET",
      url: "/api/lot/detail",
      contentType : "application/json", 
      context: this,
      headers: {
        token: this.loginUser.token
      },
      data: {
        lotId: lotId
      },
      success(data) {
        if (data.code === 1){
          this.$refs.busyIndicator.hide();
          var item = data.content.lot;
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
            auctionAt: item.auctionAt,
            sceneEx: item.sceneEx
          }
          var breadItems = [{
            path: window.location.origin + "/home.html",
            label: "Home"
          }];
          if (lotItem.category && lotItem.category.length){
            for (var i = 0; i < lotItem.category.length; i++){
              //var categoryItem = meebidUtils.findObject(this.categoryItems, "id", detailList[i].value);
              breadItems.push({
                path: window.location.origin + "/home.html",
                label: lotItem.category[i].label
              });
            }
          }
          breadItems.push({
            label: lotItem.name
          });
          this.breadItems = breadItems;
          this.lotItem = lotItem;
        } else {
          this.$notify.error({
            title: 'Failure',
            message: 'Fetch Lot failure',
            duration: 5000
          })
        }
        
      },
      error(data) {
        errorUtils.requestError(data);
      }
    });
  },

  methods: {
    onSearch(value) {
      //this.$refs.homePageListContainer.searchByKeyword(value);
    },
    getEsitmationPrice(item) {
      return meebidUtils.formatMoneyForNumberField(item.currencyCode, item.estMinPrice) 
        + " - "
        + meebidUtils.formatMoneyForNumberField(item.currencyCode, item.estMaxPrice);
    },
    getStartPrice(item){
      return meebidUtils.formatMoneyForNumberField(item.currencyCode, item.startingBid);
    },  
    getDate(date){
      if (date){
        return meebidUtils.formatDate(date, i18n.t('meebid.common.MSG_DATE_TIME_DETAIL_FORMAT'));
      } else {
        return "";
      }
    },
    isBiddingAddressVisible(lotItem){
      return lotItem && lotItem.sceneEx && lotItem.sceneEx.id > 0;
    },
    getAddress(address){
      var showAddress = "";
      if (address.botRegionLbl){
        showAddress += address.botRegionLbl + ", ";
      }
      if (address.secRegionLbl){
        showAddress += address.secRegionLbl + ", ";
      }
      if (address.topRegionLbl){
        showAddress += address.topRegionLbl;
      }
      return showAddress;
    },
    getAuctionType(sceneEx){
      var auctionType = sceneEx && sceneEx.auctionType !== null ? sceneEx.auctionType : null;
      if (auctionType !== null) {
        switch(auctionType){
          case window.meebidConstant.auctionType.Timed:
            return i18n.t('meebid.auctionManagement.MSG_AUCTION_TYPE_TIMED_TEXT');
          case window.meebidConstant.auctionType.Live:
            return i18n.t('meebid.auctionManagement.MSG_AUCTION_TYPE_LIVE_TEXT');
          case window.meebidConstant.auctionType.CategoryOnly:
            return i18n.t('meebid.auctionManagement.MSG_AUCTION_TYPE_CATEGORY_ONLY_TEXT');
          default:
            return "";
        }
      } else {
        return "";
      }
    }
  }
}
</script>

<style>
#app {
  font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
}
</style>
