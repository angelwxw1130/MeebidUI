<template>
  <div id="app" class="meebid">
    <div id="header" class="meebidAdminHeader">
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home" :button-click="redirectToHome">
        </meebid-button>
      </div>
    </div>
    <div id="content" class="meebidAdminContentWrapper" >
      <el-container v-loading="loading" element-loading-text="We are validating your account, please wait..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        
        <el-main>Main</el-main>
      </el-container>
    </div>
    
  </div>
</template>

<script>
import $ from 'jquery'
import loginUtils from './../../utils/loginUtils'
export default {
  data () {
    return {
      loading: false,
      loginUser: loginUtils.getLoginUser()
    }
  },
  mounted() {
    var me = this;
    console.log("Email Validateion Page Ready");
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 3000);
  },

  methods: {
    
  }
}
</script>

<style>
html
{
  height:100%;
  margin:0;
}
body
{
  height:100%;
  margin:0; 
}
#app {
  height: 100%;
}
</style>
