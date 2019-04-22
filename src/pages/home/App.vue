<template>
  <div id="app" class="meebidHomePage meebid">
    <meebid-header :first-name="firstName" :userProfile="userProfile" @search="onSearch" :isHomePage="true" @categoryChange="onCategoryChange">
    </meebid-header>
    <div id="content" class="meebidContent" height="">
      <div class="meebidHomePageListWrapper">
        <meebid-homepage-list ref="homePageListContainer" :isFilterActive="true" :initializedKeyword="initializedKeyword" :defaultSelectedCategory="defaultSelectedCategory">
        </meebid-homepage-list>
      </div>      
      <meebid-button v-if="userId != -1" button-type="round orange" :button-click="show" icon-type="comment" class="im" :hintNumber ="unread"> 
      </meebid-button>
      <transition name="fold">
        <meebidim ref="meebidIM" class="meebidIMPophover" style="z-index: 10" @reconnect="reconnect" :userProfile="userProfile" :socketRoomId="socketRoomId" :chatUserId="houseUserId" :lotId="lotId" :headPortrait="headPortrait" :firstName="firstName" 
        :userId="userId" v-show="panelShow"  :ws="ws" @hidewindow="hide" @showImage="showImage" @changeTotalUnread="changeTotalUnread"></meebidim>
        
      </transition>
      
      <meebid-busy-indicator ref="busyIndicator" size="Medium"></meebid-busy-indicator>
    </div>
    <meebid-category-dialog :items="categoryItems" ref="categoryDialog">
    </meebid-category-dialog>
    <el-dialog
      :visible.sync="imageDialogVisible"
      class="meebidLotDetailImageDialog">
      <img :src="expandUrl"></img>
    </el-dialog>
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
      imageDialogVisible: false,
      expandUrl: "", 
      userId:-1,
      socketRoomId:"",
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
    var keyword = meebidUtils.getQueryString(decodeData, "keyword");
    if (keyword){
      this.initializedKeyword = keyword;
    }
    var defaultSelectedCategory = meebidUtils.getQueryString(decodeData, "category");
    if (defaultSelectedCategory){
      this.defaultSelectedCategory = defaultSelectedCategory;
    }
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
    showImage(url){console.log(url);
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
      tt = setTimeout(  () =>{
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
