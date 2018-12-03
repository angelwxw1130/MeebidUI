<template>
  <div id="app" class="meebidHomePage meebid" :style="{minHeight: windowMinHeight}">
    <meebid-header :first-name="firstName" :profile-tooltip-visible="profileTooltipVisible" :profile-tooltip-disabled="profileTooltipDisabled" @search="onSearch">
    </meebid-header>
    
   
    <div id="content" class="meebidContent meebidAuctionHouseDetailContent meebidPaddingLeftLarge meebidPaddingRightLarge" >
       <meebid-button button-type="round" :button-click="show" text="icon" class="im"> 
        </meebid-button>
        <transition name="fold">
          <meebidim :userId="userId" v-show="panelShow" :panelShow="panelShow" style="transform: translate3d(200px, 0, 0);" ></meebidim>
        </transition>
        
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
    profileData: Object,
    panelShow: {
            type: Boolean
        }
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
      userId:-1,
      roomId:"",
      searchType:"auctionHouseOnline",
      breadItems: [{
        path: window.location.origin + "/home.html",
        label: "Home"
      }],
      ws:null,
      wsUrl:"",
      socketId:"",
      chatUsers:[],
      messages:[],
      chatUser:[],
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
        }        

      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;        
        }
        if(this.userProfile.bLogoUrl){
          this.headPortrait = this.userProfile.bLogoUrl;
        }
      }
    }
    if(this.headPortrait == null){
      if(this.userId == 22){
          this.headPortrait  = "./static/user1.jpg"
      }else{
        this.headPortrait  = "./static/user2.jpg"
      }
    }
    
    this.windowMinHeight = window.innerHeight - 85 + "px";
    
  },
  mounted(){
    
   
    
  },

  methods: {
    show(){
      if(!this.panelShow){
        this.panelShow = true;
      }else{
        this.panelShow = false;
      }
     
    },
  }
}
</script>

<style>
#app {
    

   
    
    font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
  
}
.im{position:fixed; bottom:0;right:0; }
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
            transform: translateZ(0)
        }
    }
    @keyframes slideOutDown {
        0% {
            transform: translateZ(0)
        }

        to {
            visibility: hidden;
            transform: translate3d(100%,0,0)
        }
    }

    .fold-enter, .fold-leave-active {
      transform: translate3d(0, 0, 0);
    }
</style>
