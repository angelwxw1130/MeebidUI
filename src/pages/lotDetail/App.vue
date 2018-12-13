<template>
  <div id="app" class="meebidHomePage meebid" :style="{minHeight: windowMinHeight}">
    <meebid-header ref="meebidHeader" :first-name="firstName">
    </meebid-header>
    <div id="content" class="meebidContent meebidLotDetailContent">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <meebid-breadcrumb-item v-for="breadItem in breadItems" :redirectUrl="{ path: breadItem.path }">{{breadItem.label}}</meebid-breadcrumb-item>
      </el-breadcrumb>
      <div class="meebidLotDetailCuttingLineGrey meebidLotDetailMainContentContainer meebidMarginTopMedium" >
        <div class="meebidLotDetailDescriptionHeaderContainer">
          <div class="meebidLotDetailDescriptionLotNoContainer meebidPaddingRightMedium meebidPaddingLeftMedium meebidMarginTopSmall">
            <span class="meebidLotDetailDescriptionLot"><b>LOT</b></span><br/>
            <span class="meebidLotDetailDescriptionLotNo">{{lotItem.no}}</span>
          </div>
          <div class="meebidLotDetailDescriptionLotNameContainer meebidPaddingLeftMedium meebidMarginTopSmall">
            <div class="meebidLotDetailDescriptionLotName"><span :title="lotItem.name">{{lotItem.name}}</span></div>
            <div><span class="meebidLotDetailDescriptionAuction">In </span>
              <a class="meebidLotDetailDescriptionAuctionLink">{{lotItem.name}}</a>
            </div>
          </div>
        </div>
        <div class="meebidLotDetailCarouselContainer meebidPaddingTopLarge">
          <meebid-carousel type="card" indicator-type="image" indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="item in lotItem.imageUrls" :label="item">
              <div class="meebidLotDetailImageContainer" @click="onShowPhoto(item)">
                <img :src="item"></img>
              </div>
            </el-carousel-item>
          </meebid-carousel>
        </div>
        <div class="meebidLotDetailInformationContainer meebidPaddingLeftMedium meebidPaddingTopLarge">
          <div class="meebidLotDetailDescriptionContainer">
            <div>
              <div class="meebidLotDetailPreviousLotLink meebidLink" @click="onShowLot(lotItem.neiLots.prev.id)">
                <div v-if="lotItem.neiLots && lotItem.neiLots.prev && lotItem.neiLots.prev.id !== null"><i class="el-icon-arrow-left"></i> Prev lot: {{lotItem.neiLots.prev.no}}</div>
              </div>
              <div class="meebidLotDetailNextLotLink meebidLink" @click="onShowLot(lotItem.neiLots.next.id)">
                <div v-if="lotItem.neiLots && lotItem.neiLots.next && lotItem.neiLots.next.id !== null" >Next lot: {{lotItem.neiLots.next.no}} <i class="el-icon-arrow-right"></i></div>
              </div>
            </div>
            <div class="meebidLotDetailDescriptionEstPriceContainer meebidMarginTopMedium meebidMarginBottomSmall">
              <div class="meebidLotDetailDescriptionAuctionTypeContainer meebidPaddingTopSmall meebidMarginBottomMedium">
                <span>{{getAuctionType(lotItem.sceneEx)}} Auction</span>
              </div>
              <div class="meebidLotDetailDescriptionStartBidPriceContainer meebidPaddingTopSmall meebidMarginBottomSmall">
                <span class="meebidLotDetailFormLabel">Opening Price:</span>
                {{getStartPrice(lotItem)}}
              </div>
              <div class="meebidPaddingTopSmall meebidMarginBottomMedium">
                <span class="meebidLotDetailFormLabel">Auctioneer's Estimation:</span>
                {{getEsitmationPrice(lotItem)}}
              </div>
              <div class="meebidLotDetailDescriptionActionContainer">
                <div class="meebidVerticalDivider"></div>
                <div class="meebidLotDetailDescriptionActionLeftContainer">
                  <div class="meebidLink"><span class="glyphicon glyphicon-heart"></span> Add to watch list</div>
                  <span> ({{getFavorText(lotItem.favor)}})</span>
                </div>
                <div class="meebidLotDetailDescriptionActionRightContainer" @click="onRegisterLot">
                  <div class="meebidLink"><span class="glyphicon glyphicon-registration-mark"></span> {{getRegisterLabel(lotItem.applys)}}</div>
                </div>
              </div>
            </div>

            <div class="meebidLotDetailDescriptionAuctionTimeContainer meebidPaddingTopSmall">
              <span class="meebidLotDetailFormLightLabel">Live Auction:</span>
              <span>{{getDate(lotItem.auctionAt, lotItem.sceneEx)}}</span>
            </div>
            <div v-if="isBiddingAddressVisible(lotItem)" class="meebidLotDetailDescriptionAuctionLocationContainer">
              <span class="meebidLotDetailFormLightLabel">Location:</span>
              <span><b>{{getAddress(lotItem.sceneEx)}}</b></span>
            </div>
            <div class="meebidLotDetailDescriptionAuctionLocationContainer">
              <span class="meebidLotDetailFormLightLabel">Shipping:</span>
              <div class="meebidLink meebidLotDetailSeeOptionLink" @click="showShippingInfo">See options</div>
            </div>
            <!--<div class="meebidLotDetailDescriptionAuctionTypeContainer meebidPaddingTopSmall meebidMarginBottomMedium">
              <span>{{getAuctionType(lotItem.sceneEx)}}</span>
            </div>-->
            <div class="meebidLotDetailDescriptionSavedContainer meebidMarginBottomMedium meebidMarginTopMedium meebidLotDetailCuttingLineGrey">

              <div class="meebidLotDetailDescriptionAuctionHouseContainer meebidPaddingTopMedium">
                <span class="meebidLotDetailFormLightLabel">Auctioneer:</span>
                <div v-if="lotItem.sceneEx.houseLogo" class="meebidLotDetailHouseLogoImageContainer">
                  <img :src="lotItem.sceneEx.houseLogo"></img>
                </div>
                <div class="meebidAuctionInfo">
                  <div class="meebidLotDetailDescriptionAuctionHouseName">
                    <span>{{lotItem.sceneEx.houseName}}</span>
                  </div>
                  <div>
                    <span>{{lotItem.sceneEx.houseEmail}}</span>
                  </div>
                  <div>
                    <span>{{lotItem.sceneEx.houseTel}}</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div class="meebidPaddingTopHuge">
        <el-collapse v-model="activeNames" @change="handleCollapseChange" >
          <el-collapse-item title="Item Overview" name="description">
            <div><b>Description: </b><br/><span ref="descriptionContainer"></span></div>
          </el-collapse-item>
          <el-collapse-item title="Terms and Condition" name="terms">
            <div class="meebidLotDetailTermsAndConditionContainer ql-editor">
              <div ref="terms"></div>
              <meebid-busy-indicator ref="temrsBusyIndicator" size="Medium"></meebid-busy-indicator>
            </div>
            <div class="meebidLotDetailEditor">
              <meebid-text-editor ref="termsEditor" compId="terms"></meebid-text-editor>
            </div>
          </el-collapse-item>
          <el-collapse-item title="Payment" name="paymentInfo">
            <div class="meebidLotDetailTermsAndConditionContainer ql-editor">
              <div ref="paymentInfo"></div>
              <meebid-busy-indicator ref="paymentBusyIndicator" size="Medium"></meebid-busy-indicator>
            </div>
            <div class="meebidLotDetailEditor">
              <meebid-text-editor ref="paymentEditor" compId="paymentInfo"></meebid-text-editor>
            </div>
          </el-collapse-item>
          <el-collapse-item title="Shipping" name="shippingInfo" ref="shippingInfoContainer">
            <div class="meebidLotDetailTermsAndConditionContainer ql-editor">
              <div ref="shippingInfo"></div>
              <meebid-busy-indicator ref="shippingBusyIndicator" size="Medium"></meebid-busy-indicator>
            </div>
            <div class="meebidLotDetailEditor">
              <meebid-text-editor ref="shippingEditor" compId="shippingInfo"></meebid-text-editor>
            </div>
          </el-collapse-item>
        </el-collapse>

      </div>
    </div>
    
    <el-dialog
      :visible.sync="imageDialogVisible"
      class="meebidLotDetailImageDialog">
      <img :src="expandUrl"></img>
    </el-dialog>
    <meebid-register-dialog ref="registerDialog"></meebid-register-dialog>
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
      imageDialogVisible: false,
      activeNames: ["description"],
      profileTooltipVisible: false,
      profileTooltipDisabled: true,
      scrollToElement: null,
      loginUser: loginUtils.getLoginUser(),
      userProfile: {
      },
      firstName: "User",
      windowMinHeight: 0,
      categoryItems: [],
      lotItem: {
        imageUrls: [],
        sceneEx: {},
        neiLots: {},
        applys: []
      },
      breadItems: [{
        path: window.location.origin + "/home.html",
        label: "Home"
      }],
      isTermsLoaded: false,
      expandUrl: ""
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
    this.$refs.temrsBusyIndicator.show();
    this.$refs.paymentBusyIndicator.show();
    this.$refs.shippingBusyIndicator.show();
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
            //description: meebidUtils.escapeHTML(item.description, "<br/>"),
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
            sceneId: item.sceneId,
            auctionAt: item.auctionAt,
            sceneEx: item.sceneEx,
            neiLots: item.neiLots,
            applys: item.applys
          }
          var breadItems = [{
            path: window.location.origin + "/home.html",
            label: "Home"
          }];
          /*if (lotItem.category && lotItem.category.length){
            for (var i = 0; i < lotItem.category.length; i++){
              //var categoryItem = meebidUtils.findObject(this.categoryItems, "id", detailList[i].value);
              breadItems.push({
                path: window.location.origin + "/home.html",
                label: lotItem.category[i].label
              });
            }
          }*/

          if (lotItem && lotItem.sceneEx){
            breadItems.push({
              path: window.location.origin + "/auctionHouseDetail.html?" + window.btoa("auctionHouseId=" + lotItem.houseId),
              label: lotItem.sceneEx.houseName
            });
            breadItems.push({
              path: window.location.origin + "/auctionDetail.html?" + window.btoa("auctionId=" + lotItem.sceneEx.sceneId),
              label: lotItem.sceneEx.sceneName
            });
          }
          breadItems.push({
            label: lotItem.name
          });
          this.breadItems = breadItems;
          this.lotItem = lotItem;
          this.$refs.descriptionContainer.innerHTML = meebidUtils.escapeHTML(item.description, "<br/>");
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
    getEsitmationPrice(item) {
      return meebidUtils.formatMoneyForNumberField(item.currencyCode, item.estMinPrice, true, 0, true) 
        + " - "
        + meebidUtils.formatMoneyForNumberField(item.currencyCode, item.estMaxPrice, true, 0, true);
    },
    getStartPrice(item){
      return meebidUtils.formatMoneyForNumberField(item.currencyCode, item.startingBid, true, 0, true);
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
        return dateStr;
      } else {
        return "";
      }
    },
    isBiddingAddressVisible(lotItem){
      return lotItem && lotItem.sceneEx && lotItem.sceneEx.id !== null;
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
    },
    getFavorText(favor){
      return i18n.t('meebid.lotDetail.MSG_FAVOR_TEXT', {
        0: favor
      });
    },
    checkCollapseItem(val){
      if (val && val.length){
        for (var i = 0; i < val.length; i++){
          if (val[i] === "terms" || val[i] === "paymentInfo" || val[i] === "shippingInfo"){
            return true;
          }
        }
      }
      return false;
    },
    handleCollapseChange(val) {
      var me = this;
      if (this.checkCollapseItem(val) && !this.isTermsLoaded){
        $.ajax({  
          url : "/api/public/pts/settings",  
          type : 'GET',
          headers: {
            token: this.loginUser.token
          },
          contentType : "application/json", 
          data: {
            lotId: this.lotItem.id
          },
          success : function(data) {
            if (data.code == 1){
              me.$refs.termsEditor.setValue(JSON.parse(data.content.termsAndCondition));
              me.$refs.paymentEditor.setValue(JSON.parse(data.content.paymentInfo));
              me.$refs.shippingEditor.setValue(JSON.parse(data.content.shippingInfo));
              me.$refs.terms.innerHTML = me.$refs.termsEditor.getHTML();
              me.$refs.paymentInfo.innerHTML = me.$refs.paymentEditor.getHTML();
              me.$refs.shippingInfo.innerHTML = me.$refs.shippingEditor.getHTML();
              me.$nextTick(function () {
                me.afterCollapsed();
              });
              
            } else {
              errorUtils.requestDataError(data)
            }
          },  
          error : function(data) {  
            errorUtils.requestError(data);
          },  
          dataType : 'json' 
        }).done(function(){
          me.$refs.temrsBusyIndicator.hide();
          me.$refs.paymentBusyIndicator.hide();
          me.$refs.shippingBusyIndicator.hide();
          me.isTermsLoaded = true;
        });
      }

    },
    onShowPhoto(url){
      this.expandUrl = url;
      this.imageDialogVisible = true;
    },
    onShowLot(lotId){
      window.location.href = "./lotDetail.html?" + window.btoa("lotId=" + lotId);
    },
    showShippingInfo() {
      var isShippingVisible = false;
      for (var i = 0; i < this.activeNames.length; i++){
        if (this.activeNames[i] === "shippingInfo"){
          isShippingVisible = true;
        }
      }
      if (isShippingVisible){
        this.$refs.shippingInfo.scrollIntoView(true)
      } else {
        this.activeNames.push("shippingInfo");
        this.scrollToElement = this.$refs.shippingInfo;
        this.handleCollapseChange(this.activeNames);
      }
    },
    afterCollapsed() {
      var me = this;
      if (this.scrollToElement) {
        setTimeout(function(){
          me.scrollToElement.scrollIntoView(true);
          me.scrollToElement = null;
        }, 200)
      }
    },
    onRegisterLot() {
      if (!this.loginUser.isLogin) {
        this.$refs.meebidHeader.openLoginDialog();
      } else {
        this.$refs.registerDialog.openDialog(this.lotItem);
      }
    },
    getRegisterLabel(applys) {
      return applys && applys.length > 0 ? "My Registration(s)" : "Register to bid";
    }
  }
}
</script>

<style>
#app {
  font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
}
</style>
