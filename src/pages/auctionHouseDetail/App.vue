<template>
  <div id="app" class="meebidHomePage meebid" :style="{minHeight: windowMinHeight}">
    <meebid-header :first-name="firstName" :profile-tooltip-visible="profileTooltipVisible" :profile-tooltip-disabled="profileTooltipDisabled" @search="onSearch">
    </meebid-header>
    <div id="content" class="meebidContent meebidAuctionHouseDetailContent meebidPaddingLeftLarge meebidPaddingRightLarge">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="meebidAuctionDetailBreadcrumb meebidPaddingTopMedium">
        <meebid-breadcrumb-item v-for="breadItem in breadItems" :redirectUrl="{ path: breadItem.path }">{{breadItem.label}}</meebid-breadcrumb-item>
      </el-breadcrumb>
      
      <meebid-switch class="meebidAuctionHouseViewSwitcher" v-model="value1" :showHelpText="true" :helpTextSwitchOn="$t('meebid.auctionDetail.MSG_SHOW_UPCOMING_AUCTIONS')" :helpTextSwitchOff="$t('meebid.auctionDetail.MSG_SHOW_PAST_AUCTIONS')" @switchChange="switchChange"></meebid-switch>
      
      <div class="meebidAuctionHouseDetailAuctionDescriptionContainer meebidMarginTopMedium">
        <div class="meebidAuctionHouseDetailDescriptionAuctionHouseContainer">
          <div v-if="houseItem.logo" class="col-md-4 meebidAuctionHouseDetailHouseLogoImageContainer">
            <img :src="houseItem.logo"></img>
          </div>
          <div class="col-md-8">
            <div class="meebidAuctionInfo">
              <div class="meebidAuctionHouseDetailDescriptionAuctionName">
                <span>{{houseItem.name}}</span>
              </div>
              <div class="meebidAuctionHouseDetailDescriptionAuctionHouseName">
                <a @click="onClickAuctionHouse(houseItem.website)">{{houseItem.website}}</a>
              </div>
              <div>
                <span>{{houseItem.email}}</span>
              </div>
              <div>
                <span>{{houseItem.cellphone}}</span>
              </div>
              <!--<div class="meebidMarginTopSmall">
                <span>{{getDate(auctionItem.startAt, auctionItem.sceneEx)}}</span>
              </div>-->
            </div>
          </div>
        </div>
      </div>
      <div class="meebidAuctionHouseDetailMainContentContainer meebidMarginTopMedium" >
        <meebid-housepage-list ref="homePageListContainer" :showViewSwitch="true" :searchType="searchType" :houseId="houseId">
        </meebid-housepage-list>

      </div>
    </div>
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
      scrollToElement: null,
      loginUser: loginUtils.getLoginUser(),
      userProfile: {
      },
      firstName: "User",
      windowMinHeight: 0,
      houseItem: {
        users: {}
      },
      houseId:-1,
      searchType:"auctionHouseOnline",
      breadItems: [{
        path: window.location.origin + "/home.html",
        label: "Home"
      }],
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
    var paramsString = window.location.search;
    paramsString = paramsString.substring(1);
    var decodeData = window.atob(paramsString);
    var houseId = meebidUtils.getQueryString(decodeData, "auctionHouseId");
    this.windowMinHeight = window.innerHeight - 85 + "px";
    this.houseId = houseId;
  },
  mounted(){
    this.$refs.busyIndicator.show();
    //get house detail info
    $.ajax({
      type: "GET",
      url: "/api/user/outline",
      contentType : "application/json", 
      context: this,
      headers: {
        token: this.loginUser.token
      },
      data: {
        userId: this.houseId
      },
      success(data) {
        if (data.code === 1){
          this.$refs.busyIndicator.hide();
          var item = data.content.user;
          var houseItem = {
            name: item.name,
            contact: item.contact,
            cellphone: item.cellphone,
            id: item.id,
            email:item.email,
            website:item.website,
            contact_users:item.contact_users,
            contact_name: item.contact_name,
            logo: item.bLogoUrl
            
          }

          var breadItems = [{
            path: window.location.origin + "/home.html",
            label: "Home"
          }];

          breadItems.push({
            label: houseItem.name
          });
          this.breadItems = breadItems;
          this.houseItem = houseItem;
          this.$refs.homePageListContainer.showBusyIndicator();
        } else {
          this.$notify.error({
            title: 'Failure',
            message: 'Fetch Auction failure',
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
    onClickAuctionHouse(auctionHouseUrl) {
      window.open(auctionHouseUrl);    
    },
    switchChange(switchValue){
      this.$refs.homePageListContainer.changeViewItem(switchValue);
    },
    show() {
        alert(this.value1);
      }
  }
}
</script>

<style>
#app {
  font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
}
</style>
