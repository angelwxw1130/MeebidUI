<template>
  <div id="app" class="meebidHomePage meebid">
    <div id="header" class="meebidHomeHeader">
      <meebid-search-typeahead class="meebidtypeahead"
             async-src="https://api.github.com/search/users?q="
             async-key="items"
             item-key="login"
             :force-select="true">
        <span class="glyphicon glyphicon-search meebidHeaderSearchIcon"></span>
        <input data-role="input" class="form-control" type="text" placeholder="Search">
        <template slot="item" slot-scope="props">
          <li ref="props.typeaheadBusyIndicator"><meebid-busy-indicator size="Medium"></meebid-busy-indicator></li>
          <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
            <a href="javascript:void(0)" @click="props.select(item)">
              <div>
                <img width="36px" height="36px" :src="item.avatar_url"> 
                <span style="padding-left: 10px;">{{item.login}}</span>
              </div>
            </a>
          </li>
          <li v-show="props.noResult"><div class="noResult">No Data</div></li>
        </template>
      </meebid-search-typeahead>
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home" :button-click="changeHintMessage">
        </meebid-button>
        <template v-if="loginUser.isLogin === false">
          <meebid-button icon-type="log-in" button-type="round" text="Login" :button-click="openLoginDialog">
          </meebid-button>
          <meebid-button icon-type="user" button-type="round" text="Register" :button-click="openRegisterDialog">
          </meebid-button>
        </template>
        <template v-else>
          <el-tooltip v-model="profileTooltipVisible" class="item" effect="light" content="Please update your personal information first" placement="bottom" :disabled="profileTooltipDisabled">
            <meebid-button icon-type="user" button-type="round" :text="firstName" :button-click="openUserProfile">
            </meebid-button>
          </el-tooltip>
          <!--<meebid-button icon-type="bell" button-type="round" ref="hintButton" data-role="trigger" :button-click="openCategoryDialog">
          </meebid-button>
          <meebid-button icon-type="menu-hamburger" button-type="round" :button-click="showAlert" >
          </meebid-button>-->
          <meebid-button icon-type="log-out" button-type="round" text="Logout" :button-click="onLogout" >
          </meebid-button>
        </template>
      </div>
    </div>
    <div id="content" class="meebidHomeContent" height="">
      <meebid-homepage-list ref="homePageListContainer">
      </meebid-homepage-list>
      <meebid-busy-indicator ref="busyIndicator" size="Medium"></meebid-busy-indicator>
    </div>
    

    <el-dialog
      title="Login"
      :visible.sync="loginDialogVisible"
      class="meebidLoginDialog"
      width="400px">
      
        <div class="meebidLoginDialogLabel">Returning User</div>
        <el-form ref="loginFormRef" class="meebidLoginDialogForm" :model="loginForm" label-width="0px">
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="Please input email address" auto-complete="new-password"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="Please input password" auto-complete="new-password"></el-input>
          </el-form-item>
          <a class="meebidLink" @click="onForgetPassword">{{$t('meebid.common.MSG_FORGET_PASSWORD_LINK_TEXT')}}</a>
        </el-form>
        

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onLogin" class="meebidLoginDialogButton">LOGGED IN</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Register"
      :visible.sync="registerDialogVisible"
      class="meebidRegisterDialog"
      width="600px">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="registerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="registerDialogVisible = false">Register</el-button>
      </span>
    </el-dialog>
    <meebid-category-dialog :items="categoryItems" ref="categoryDialog">
    </meebid-category-dialog>
  </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
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
      registerDialogVisible: false,
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
      categoryItems: []
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
        var categoryItems = this.$parent.$data.categories;
        var selectedItems = this.userProfileForm && this.userProfileForm.favorCategories ? this.userProfileForm.favorCategories.split(";") : [];
        for (var i = 0; i < categoryItems.length; i++){
          categoryItems[i].selected = false;
          for (var j = 0; j < selectedItems.length; j++){
            if (parseInt(selectedItems[j]) === categoryItems[i].id){
              categoryItems[i].selected = true;
              break;
            }
          }
        }
        this.categoryItems = categoryItems;
      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;
        }
      }
      if (this.userProfile.type === window.meebidConstant.userType.member && (this.userProfile.favorCategories === "" || this.userProfile.favorCategories === null || this.userProfile.favorCategories === undefined)){
        this.$refs.categoryDialog.categoryDialogVisible = true;
        this.profileTooltipVisible = true;
        this.profileTooltipDisabled = false;
      }
    }
  },
  mounted(){
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock1.jpg",
      avatarUrl: "./../static/user1.jpg",
      imageProvider: "Carrie Beth",
      imageName: "The big day ❤️",
      description: "Vintage French Clock | home antique clocks antique french…",
      favouriteCount: "729",
      meebidListItemClass: {
        transform: "translateX(0px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock2.jpg",
      avatarUrl: "./../static/user2.jpg",
      imageProvider: "Here should be Auction",
      imageName: "Auction Item Name",
      description: ".would love to know the orgin of this pic. i bet our resto…",
      favouriteCount: "4.3k",
      meebidListItemClass: {
        transform: "translateX(260px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock3.jpg",
      avatarUrl: "./../static/user3.jpg",
      imageProvider: "Melinda Earll",
      imageName: "antique French clocks",
      description: "French Porcelain Mounted Ormolu Calendar Mantel Clock by…",
      favouriteCount: "221",
      meebidListItemClass: {
        transform: "translateX(520px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock4.jpg",
      avatarUrl: "./../static/user4.jpg",
      imageProvider: "Charlene Clouser",
      imageName: "Time pieces",
      description: "Late 18TH CENTURY FRENCH EMPIRE ORMOLU MANTEL CLOCK the dial…",
      favouriteCount: "84",
      meebidListItemClass: {
        transform: "translateX(780px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock5.jpg",
      avatarUrl: "./../static/user5.jpg",
      imageProvider: "Catheryne Tope",
      imageName: "Baroque Tall Case Clock",
      description: "French Clock from the Baroque Period. This type of clock was…",
      favouriteCount: "513",
      meebidListItemClass: {
        transform: "translateX(1040px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock6.jpg",
      avatarUrl: "./../static/user6.jpg",
      imageProvider: "Gaia Semerdjyan",
      imageName: "Clocks",
      description: "Eighteenth-Century French Clocks | The Frick Collection",
      favouriteCount: "22",
      meebidListItemClass: {
        transform: "translateX(0px) translateY(560px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock7.jpg",
      avatarUrl: "./../static/user7.jpg",
      imageProvider: "Garrett Bay",
      imageName: "projects",
      description: "Beautiful antique gilt figural clock.",
      favouriteCount: "813",
      meebidListItemClass: {
        transform: "translateX(260px) translateY(507px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock8.jpg",
      avatarUrl: "./../static/user8.jpg",
      imageProvider: "Belinda Vernon",
      imageName: "Victorian",
      description: "AN UNUSUAL 19TH CENTURY FRENCH CHAMPLEVE ENAMEL BRONZE…",
      favouriteCount: "164",
      meebidListItemClass: {
        transform: "translateX(520px) translateY(523px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock9.jpg",
      avatarUrl: "./../static/user9.jpg",
      imageProvider: "Ed Clarke",
      imageName: "Lara's Design Inspiration",
      description: "Antique clock French 1800. A modern equivalent would look…",
      favouriteCount: "2.7k",
      meebidListItemClass: {
        transform: "translateX(780px) translateY(469px)"
      }
    });
  },

  methods: {
    openCategoryDialog() {
      this.$refs.categoryDialog.categoryDialogVisible = true;
      this.$refs.categoryDialog.validateSelectedItem();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    openLoginDialog: function(){
      this.loginDialogVisible = true;
    },
    onLogout () {
      this.$confirm(i18n.t('meebid.alertMessage.MSG_LOGOUT_CONFIRMATION_TEXT'), 'LOGOUT', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        loginUtils.setLoginUser()
        window.location.reload()
      });
    },
    onLogin: function(){
      var me = this;
      var email = this.loginForm.email;
      var password = this.loginForm.password;
      if (email && password){
        $.ajax({  
          url : "/api/user/login",  
          type : 'POST',  
          data : JSON.stringify({  
            email : email,  
            password : password  
          }),
          context: me,
          contentType : "application/json", 
          success : function(data) {
            if (data.code == '1'){
              let currentDate = new Date()
              currentDate.setTime(currentDate.getTime() + data.content.expiredAt * 1000)
              loginUtils.setLoginUser({
                expireTime: currentDate.getTime(),
                token: data.content.token
              })
              this.$refs.loginFormRef.resetFields()
              window.location.reload()
            } else if (data.code === -4) {
              var messageKey = 'meebid.alertMessage.' + data.msg;
              this.$message.error(i18n.t(messageKey));
            } else {  
              this.$notify({
                title: 'Failure',
                message: 'Login failed',
                duration: 5000
              })
            }    
          },  
          error : function(data) {  
            errorUtils.requestError(data);
          },  
          dataType : 'json' 
        })  
      }
    },
    openRegisterDialog: function(){
      window.location.href = "./register.html";
    },
    openUserProfile() {
      window.location.href = "./admin.html";
    },
    onForgetPassword() {
      window.location.href = "./forgetPassword.html";
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
    showAlert : function(){
      if (this.$refs.busyIndicator.active){
        this.$refs.busyIndicator.hide()
      } else {
        this.$refs.busyIndicator.show()
      }
      
      //this.$set('alertIsOpen',true);
    },
    getSelectedRegionOptions(regions, regionOptions){
      for (var i = 0; i < regionOptions.length; i++){
        var regionOption = regionOptions[i];
        if (regionOption.id === regions[0]){
          var nextRegions = regions.splice(0, 1);
          if (nextRegions && nextRegions.length > 0){
            return this.getSelectedRegionOptions(nextRegions, regionOption.childrens);
          } else {
            return regionOption;
          }
        }
      }
    },
    handleAddressChange(val) {
      if (val && val.length > 0){
        var regionOption = this.getSelectedRegionOptions(val, this.regionOptions);
        if (regionOption.childrens && regionOption.childrens.length === 0){
          $.ajax({
            type: "GET",
            url: "/api/public/regions",
            contentType : "application/json", 
            context: this,
            data: {
              upperLevel: val[0],
              level: val.length
            },
            dataType: 'json',
            success(data) {
              if (data.code === 1){
                for (var i = 0; i < data.content.regions.length;i++){
                  data.content.regions[i].childrens = [];
                }
                regionOption.childrens = data.content.regions;
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Get Region Data failure',
                  duration: 5000
                })
              }
              
            },
            error() {
              this.$notify.error({
                title: 'Failure',
                message: 'Get Region Data failure',
                duration: 5000
              })
            }
          });
        }
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
</style>
