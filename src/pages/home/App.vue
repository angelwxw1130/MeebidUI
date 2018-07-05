<template>
  <div id="app" class="meebidHomePage meebid">
    <meebid-header :first-name="firstName" :profile-tooltip-visible="profileTooltipVisible" :profile-tooltip-disabled="profileTooltipDisabled">
    </meebid-header>
    <div id="content" class="meebidHomeContent" height="">
      <meebid-homepage-list ref="homePageListContainer">
      </meebid-homepage-list>
      <meebid-busy-indicator ref="busyIndicator" size="Medium"></meebid-busy-indicator>
    </div>
    
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
    <meebid-login-dialog>
    </meebid-login-dialog>
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
        this.categoryItems = categoryItems;
      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;
        }
      }
      if (this.userProfile.type === window.meebidConstant.userType.member && this.userProfile.favorCategories.length === 0){
        this.$refs.categoryDialog.categoryDialogVisible = true;
        this.profileTooltipVisible = true;
        this.profileTooltipDisabled = false;
      }
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
