<template>
  <div id="app" class="meebidHomePage meebid">
    <meebid-header :first-name="firstName" :userProfile="userProfile" @search="onSearch" :isHomePage="true" @categoryChange="onCategoryChange">
    </meebid-header>
    <div id="content" class="meebidContent" height="">
      <div class="meebidHomePageListWrapper">
        <meebid-homepage-list ref="homePageListContainer" :isFilterActive="true" :initializedKeyword="initializedKeyword" :defaultSelectedCategory="defaultSelectedCategory">
        </meebid-homepage-list>
      </div>      
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
      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;
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
