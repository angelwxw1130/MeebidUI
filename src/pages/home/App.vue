<template>
  <div id="app" class="meebidHomePage meebid">
    <meebid-header :first-name="firstName" :userProfile="userProfile" @search="onSearch" :isHomePage="true" @categoryChange="onCategoryChange">
    </meebid-header>
    <div id="content" class="meebidContent" height="">
      <div class="meebidHomePageListWrapper">
        <meebid-homepage-list ref="homePageListContainer" :isFilterActive="true" :initializedKeyword="initializedKeyword" :defaultSelectedCategory="defaultSelectedCategory">
        </meebid-homepage-list>
      </div>
      <meebid-button button-type="round orange" :button-click="show" icon-type="comment" class="im"> 
      </meebid-button>
      <transition name="fold">
        <meebidim class="meebidIMPophover" :headPortrait="headPortrait" :firstName="firstName" :userId="userId" v-show="panelShow" :panelShow="panelShow" :ws="ws"></meebidim>
      </transition>
      <meebid-busy-indicator ref="busyIndicator" size="Medium"></meebid-busy-indicator>
    </div>
    <meebid-category-dialog :items="categoryItems" ref="categoryDialog">
    </meebid-category-dialog>
    <meebid-login-dialog>
    </meebid-login-dialog>
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
      loginUser: loginUtils.getLoginUser(),
      userProfile: {
      },
      firstName: "User",
      loginDialogVisible: false,
      loginForm: {
        email: "",
        password: ""
      },
      initializedKeyword: '',
      defaultSelectedCategory: -1,
      loginFormRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' }          
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' }    
        ],
      },
      categoryItems: [],
      userId:-1,
      roomId:"",
      headPortrait:"",
      wsUrl:"",
      ws:null,
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
        var categoryItems = this.$parent.$data.categories;
        this.categoryItems = categoryItems;
      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;
        }
        if(this.userProfile.bLogoUrl){
          this.headPortrait = this.userProfile.bLogoUrl;
        }
      }
    }
    //临时头像 
    if(this.headPortrait == null || this.headPortrait == ""){
      if(this.userId == 22){
          this.headPortrait  = "./static/user1.jpg"
      }else{
        this.headPortrait  = "./static/user2.jpg"
      }
    }
    var paramsString = window.location.search;
    paramsString = paramsString.substring(1);
    var decodeData = window.atob(paramsString);
    var keyword = meebidUtils.getQueryString(decodeData, "keyword");
    if (keyword){
      this.initializedKeyword = keyword;
    }
    var defaultSelectedCategory = meebidUtils.getQueryString(decodeData, "category");
    if (defaultSelectedCategory){
      this.defaultSelectedCategory = defaultSelectedCategory;
    }
    console.log(this.headPortrait);
  },
  mounted(){
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    startHacking () {
      this.$notify({
        title: 'Shhh',
        message: 'Just be patient...',
        duration: 6000
      })
    },
    changeHintMessage: function(){
      //this.$refs.hintButton.hintNumber++;
      
    },
    onSearch(value) {
      this.$refs.homePageListContainer.searchByKeyword(value);
    },
    onCategoryChange(categoryId) {
      this.$refs.homePageListContainer.setFilterCategory(categoryId);
    },
    show(){
      if(this.ws == null){
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
                    this.roomId = data.content.roomId;
                    
                    if ("WebSocket" in window) {
                      this.ws = new WebSocket(this.wsUrl);
                    }
                    else if ("MozWebSocket" in window) {
                      this.ws = new MozWebSocket(this.wsUrl);
                    } else {
                      console.log("当前浏览器不支持WebSocket");

                    }
                    
                    //this.$emit('getSocketUrl',{wsurl: wsUrl, roomId: data.content.roomId,chatUserId:userId}); 

                }

            },
            error(data) {
                errorUtils.requestError(data);
            }
        });
      }
      if(!this.panelShow){
        this.panelShow = true;
      }else{
        this.panelShow = false;
      }
     
    },
    
  }
}
/**
    <popover title="Notification">
      <meebid-button icon-type="bell" button-type="round" ref="hintButton" data-role="trigger">
      </meebid-button>
      <div slot="popover">
        <h5 >Test Notification</h5>
      </div>
    </popover>
    */
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
