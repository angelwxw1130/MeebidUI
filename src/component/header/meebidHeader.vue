<template>
  <div>
    <div id="header" class="meebidHomeHeader">
      <meebid-search-typeahead class="meebidtypeahead"
             async-src="/api/public/word/autocomplete"
             async-key="items"
             item-key="login"
             :force-select="true"
             @selectCategory="onCategoryChange"
             @search="onSearch">
        <span class="glyphicon glyphicon-search meebidHeaderSearchIcon"></span>
        <input data-role="input" class="form-control" ref="searchInput" type="text" placeholder="Search">
        <el-button type="primary" @click="onClickSearch" class="meebidSearchTypeaheadButton" icon="el-icon-search"></el-button>
        <!--<template slot="item" slot-scope="props">
          <li ref="props.typeaheadBusyIndicator"><meebid-busy-indicator size="Medium"></meebid-busy-indicator></li>
          <li v-for="(item, index) in props.wordItems">
            <a href="javascript:void(0)" @click="props.select(item)">
              <span style="padding-left: 10px;line-height: 36px;">{{item.key}}</span>
              <div v-if="item.isHouse">
                <img width="36px" height="36px" :src="item.imageUrl"> 
                <span style="padding-left: 10px;">{{item.houseName}}</span>
              </div>
            </a>
          </li>
          <li v-for="(item, index) in props.categoryItems">
            <a href="javascript:void(0)" @click="props.selectCategory(item)">
              <span style="padding-left: 10px;line-height: 36px;">{{item.key}}</span>
              <div v-if="item.isHouse">
                <img width="36px" height="36px" :src="item.imageUrl"> 
                <span style="padding-left: 10px;">{{item.houseName}}</span>
              </div>
            </a>
          </li>
          <li v-show="props.noResult"><div class="noResult">No Result</div></li>
        </template>-->
      </meebid-search-typeahead>
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home" :button-click="openHomePage">
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
          <meebid-button icon-type="menu-hamburger" button-type="round" :button-click="" >
          </meebid-button>-->
          <meebid-button icon-type="log-out" button-type="round" text="Logout" :button-click="onLogout" >
          </meebid-button>
        </template>
      </div>
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
  </div>
</template>

<script>
  import loginUtils from './../../utils/loginUtils'
  import errorUtils from './../../utils/errorUtils'
  import i18n from './../../i18n/i18n'
  import $ from 'jquery'
  export default {
    name: 'meebid-header',
    props: {
      firstName: {
        type: String,
        default: "User"
      },
      isHomePage: {
        type: Boolean,
        default: false
      },
      userProfile: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        loginUser: loginUtils.getLoginUser(),
        loginDialogVisible: false,
        profileTooltipVisible: false,
        profileTooltipDisabled: true,
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
      }
    },
    beforeMount() {

    },

    mounted() {
      if (this.loginUser.isLogin){
        if (this.userProfile.type === window.meebidConstant.userType.member && this.userProfile.favorCategories.length === 0){
          this.profileTooltipDisabled = false;
          this.profileTooltipVisible = true;
        }  
      }
    },
    methods: {
      openHomePage: function(){
        window.location.href = "./home.html";
        
      },
      openLoginDialog: function(){
        this.loginDialogVisible = true;
      },
      openRegisterDialog: function(){
        window.location.href = "./register.html";
      },
      openUserProfile() {
        window.location.href = "./admin.html";
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
                window.location.reload();
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
      onLogout () {
        this.$confirm(i18n.t('meebid.alertMessage.MSG_LOGOUT_CONFIRMATION_TEXT'), 'LOGOUT', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          loginUtils.setLoginUser()
          window.location.href = "./home.html";
        });
      },
      onForgetPassword() {
        window.location.href = "./forgetPassword.html";
      },
      showAlert : function(){
        if (this.$refs.busyIndicator.active){
          this.$refs.busyIndicator.hide()
        } else {
          this.$refs.busyIndicator.show()
        }
        
        //this.$set('alertIsOpen',true);
      },
      onSearch(value) {
        if (this.isHomePage){
          this.$emit('search', value);
        } else {
          window.location.href = "./home.html?" + window.btoa("keyword=" + value);
        }
        
      },
      onCategoryChange(categoryId) {
        if (this.isHomePage){
          this.$emit('categoryChange', categoryId);
        } else {
          window.location.href = "./home.html?" + window.btoa("category=" + categoryId);
        }
      },
      onClickSearch(){
        this.onSearch(this.$refs.searchInput.value);
      }
    },
    beforeDestroy() {

    }
  }
</script>

<style>

</style>
