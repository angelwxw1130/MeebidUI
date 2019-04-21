<template>
  <div id="app" class="meebidHomePage meebid" :style="{minHeight: windowMinHeight}">
    <meebid-header :first-name="firstName" :userProfile="userProfile">
    </meebid-header>
    <div id="content" class="meebidContent meebidAuctionDetailContent meebidPaddingLeftLarge meebidPaddingRightLarge">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="meebidAuctionDetailBreadcrumb meebidPaddingTopMedium">
        <meebid-breadcrumb-item v-for="breadItem in breadItems" :redirectUrl="{ path: breadItem.path }">{{breadItem.label}}</meebid-breadcrumb-item>
      </el-breadcrumb>
      <div class="meebidAuctionDetailAuctionDescriptionContainer meebidMarginTopMedium">
        <div class="meebidAuctionDetailDescriptionAuctionHouseContainer">
          <div v-if="auctionItem.sceneEx.houseLogo" class="meebidAuctionDetailHouseLogoImageContainer">
            <img :src="auctionItem.sceneEx.houseLogo"></img>
          </div>
          <div class="meebidAuctionInfo">
            <div class="meebidAuctionDetailDescriptionAuctionName">
              <span>{{auctionItem.name}}</span>
            </div>
            <div class="meebidAuctionDetailDescriptionAuctionHouseName">
              <a @click="onClickAuctionHouse()">{{auctionItem.sceneEx.houseName}}</a>
            </div>
            <div>
              <span>{{auctionItem.sceneEx.houseEmail}}</span>
            </div>
            <div>
              <span>{{auctionItem.sceneEx.houseTel}}</span>
            </div>
            <div class="meebidMarginTopSmall">
              <span>{{getDate(auctionItem.startAt, auctionItem.sceneEx)}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="meebidLotDetailMainContentContainer meebidMarginTopMedium" >
        <meebid-homepage-list ref="homePageListContainer" :showViewSwitch="true" searchType="auction" :sceneId="sceneId">
        </meebid-homepage-list>

      </div>
    </div>
    <meebid-button v-if="userId != -1" button-type="round orange" :button-click="show" icon-type="comment" class="im" :hintNumber ="unread"> 
      </meebid-button>
      <transition name="fold">
        <meebidim ref="meebidIM" class="meebidIMPophover" style="z-index: 10" @reconnect="reconnect" :userProfile="userProfile" :socketRoomId="socketRoomId" :chatUserId="houseUserId" :lotId="lotId" :headPortrait="headPortrait" :firstName="firstName" 
        :userId="userId" v-show="panelShow"  :ws="ws" @hidewindow="hide" @showImage="showImage" @changeTotalUnread="changeTotalUnread"></meebidim>
        
      </transition>
      <el-dialog
      :visible.sync="imageDialogVisible"
      class="meebidLotDetailImageDialog">
      <img :src="expandUrl"></img>
    </el-dialog>
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
    profileData: Object,    
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
      auctionItem: {
        sceneEx: {}
      },
      sceneId: -1,
      breadItems: [{
        path: window.location.origin + "/home.html",
        label: "Home"
      }],
      imageDialogVisible: false,
      userId:-1,
      expandUrl: "",
      roomId:"",
      headPortrait:"",
      wsUrl:"",
      ws:null,   
      unread:0, 
      lotId:"",
      houseUserId:-1,
      panelShow:false,
      lockReconnect:false,
    }
  },
  beforeMount() {
    console.log("app ready");
    if (this.$parent.$data && this.$parent.$data.user){
      this.userProfile = this.$parent.$data.user;
      this.userId = this.userProfile.id;
      if (this.userProfile.type === window.meebidConstant.userType.member){
        if (this.userProfile.firstName){
          this.firstName = this.userProfile.firstName;
        }
        this.userProfileForm = this.userProfile;
        if (this.userProfile.avatar){
          this.headPortrait = this.userProfile.avatar;
        }else{
          this.headPortrait = "http://tinygraphs.com/squares/"+this.firstName+"?theme=heatwave&numcolors=4"
        }   
      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;
        }
        if(this.userProfile.bLogoUrl){
          this.headPortrait = this.userProfile.bLogoUrl;
        }else{
          this.headPortrait ="http://tinygraphs.com/squares/"+this.firstName+"?theme=heatwave&numcolors=4"
        } 
      }
    }
    var paramsString = window.location.search;
    paramsString = paramsString.substring(1);
    var decodeData = window.atob(paramsString);
    var sceneId = meebidUtils.getQueryString(decodeData, "auctionId");
    this.windowMinHeight = window.innerHeight - 85 + "px";
    this.sceneId = sceneId;

    if(this.ws == null && this.userId != -1){//websocket为空，请登录状态，获取socketid
        //获取socketID
        $.ajax({
            type: "POST",
            url: "/api/socket/socket",
            contentType : "application/json", 
            context: this,
            headers: {
                token: this.loginUser.token
            },
            data: {},
            success(data) {
                if (data.code === 1){
                    var wsUrl = '';
                //this.$refs.busyIndicator.hide();
                    this.socketId = data.content.ws;
                    if(data.content.ws.startsWith("ws://")){
                        wsUrl = data.content.ws +"/" + this.loginUser.token;  
                    }else{
                        wsUrl = "ws://47.100.84.71:" + data.content.ws +"/" + this.loginUser.token;  
                    }
                    this.wsUrl = wsUrl
                    this.socketRoomId = data.content.roomId;
                    
                    if ("WebSocket" in window) {
                      this.ws = new WebSocket(this.wsUrl);
                    }
                    else if ("MozWebSocket" in window) {
                      this.ws = new MozWebSocket(this.wsUrl);
                    } else {
                      console.log("当前浏览器不支持WebSocket");

                    }
                    
                    this.ws.onopen = this.$refs.meebidIM.websocketonopen;
                    this.ws.onerror = this.$refs.meebidIM.websocketonerror;
                    this.ws.onmessage = this.$refs.meebidIM.websocketonmessage; 
                    this.ws.onclose = this.$refs.meebidIM.websocketclose;
                    
                    
                    //this.$emit('getSocketUrl',{wsurl: wsUrl, roomId: data.content.roomId,chatUserId:userId}); 

                }

            },
            error(data) {
                errorUtils.requestError(data);
            }
        });

        //获取未读条目数
        $.ajax({
          type: "GET",
          url: "/api/socket/chat/unread/count",
          contentType : "application/json", 
          context: this,
          headers: {
            token: this.loginUser.token
          },
          data: {},
          success(data) {
            if (data.code === 1){
              data.content.count.forEach(item =>{
                this.unread += item.value;
              });
              
            }
          }
        });
    }
  },
  mounted(){
    this.$refs.busyIndicator.show();

    $.ajax({
      type: "GET",
      url: "/api/scene/detail",
      contentType : "application/json", 
      context: this,
      headers: {
        token: this.loginUser.token
      },
      data: {
        sceneId: this.sceneId
      },
      success(data) {
        if (data.code === 1){
          this.$refs.busyIndicator.hide();
          var item = data.content.scene;
          var auctionItem = {
            name: item.name,
            description: item.description,
            currencyId: item.currencyId,
            id: item.id,
            sceneEx: item.sceneEx,
            startAt: item.startAt,
            exhibitions: item.exhibitions,
            logo: item.logo,
            auctionAt: item.auctionAt
          }

          var breadItems = [{
            path: window.location.origin + "/home.html",
            label: "Home"
          }];

          if (auctionItem && auctionItem.sceneEx){
            breadItems.push({
              path: window.location.origin + "/home.html",
              label: auctionItem.sceneEx.houseName
            });
          }
          breadItems.push({
            label: auctionItem.name
          });
          this.breadItems = breadItems;
          this.auctionItem = auctionItem;
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
    onClickAuctionHouse() {

    },
    show(){      
      this.$refs.meebidIM.getChatRooms(true,false);
      if(!this.panelShow){
        this.panelShow = true;
      }else{
        this.panelShow = false;
      }
      
    },
    hide(hidewindow){      
      this.panelShow = hidewindow;
    },
    showImage(url){
      this.expandUrl = url;
      this.imageDialogVisible = true;
    },
    changeTotalUnread(number){
      //console.log("changeTotalUnread:"+this.unread);
      this.unread = this.unread + number;
      //console.log(number);
    },
    reconnect() {
      var tt;
      if(this.lockReconnect) {
        return;
      };
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      tt && clearTimeout(tt);
      tt = setTimeout(function () {
        this.createWebSocket();
        this.lockReconnect = false;
      }, 4000);
    },
    createWebSocket() {
      try {
        //ws = new WebSocket(this.wsUrl);
        if ("WebSocket" in window) {
                      this.ws = new WebSocket(this.wsUrl);
                    }
                    else if ("MozWebSocket" in window) {
                      this.ws = new MozWebSocket(this.wsUrl);
                    } else {
                      console.log("当前浏览器不支持WebSocket");

                    }
                    
                    this.ws.onopen = this.$refs.meebidIM.websocketonopen;
                    this.ws.onerror = this.$refs.meebidIM.websocketonerror;
                    this.ws.onmessage = this.$refs.meebidIM.websocketonmessage; 
                    this.ws.onclose = this.$refs.meebidIM.websocketclose;
      } catch(e) {
        //console.log('catch');
        this.reconnect();
      }
    }
  }

  
}
</script>

<style>
#app {
  font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
}
 .im{position:fixed; bottom:20px;right:0; }
    .fold-enter-active{
        animation-name: slideInUp;
        animation-duration: .5s;
        animation-fill-mode: both
    }
    .fold-leave-active {
        animation-name: slideOutDown;
        animation-duration: .7s;
        animation-fill-mode: both
    }
    @keyframes slideInUp {
        0% {
            transform: translate3d(100%,0,0);
            visibility: visible
        }

        to {
            transform: translate3d(0%,0,0);
        }
    }
    @keyframes slideOutDown {
        0% {
            transform: translate3d(0%,0,0);
        }

        to {
            visibility: hidden;
            transform: translate3d(110%,0,0)
        }
    }

    .fold-enter, .fold-leave-active {
      transform: translate3d(0, 0, 0);
    }
</style>
