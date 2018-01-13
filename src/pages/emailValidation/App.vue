<template>
  <div id="app" class="meebid">
    <div id="header" class="meebidAdminHeader">
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home" :button-click="redirectToHome">
        </meebid-button>
      </div>
    </div>
    <div id="content" class="meebidAdminContentWrapper" >
      <el-container v-loading="loading" class="meebidValidationPageContainer meebidPaddingTopMedium" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading">
        <el-main>
          <!--<div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">Account Validateion</div>
          <div class="meebidRegisterHeaderLabel">Using validation code to activate your account</div>
          <el-form ref="validateionForm" :model="validateionForm" label-width="150px" class="meebidPaddingTopMedium">
            <el-form-item label="Validation Code" prop="code">
              <el-input v-model="validateionForm.code" placeholder="Please input your validation code here"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onValidate">VALIDATE ACCOUNT</el-button>
            </el-form-item>
          </el-form>-->
        </el-main>
      </el-container>
    </div>
    
  </div>
</template>

<script>
import $ from 'jquery'
import loginUtils from './../../utils/loginUtils'
import urlUtils from './../../utils/urlUtils'
export default {
  data () {
    return {
      loading: false,
      loadingText: "We are validating your account, please wait...",
      validateionForm: {
        code: ""
      },
      loginUser: loginUtils.getLoginUser()
    }
  },
  mounted() {
    var me = this;
    console.log("Email Validateion Page Ready");
    this.loading = true;
    var paramterStr = window.location.search;
    var code = urlUtils.getUrlParameter('code');
    $.ajax({  
      url : "/api/user/activate",  
      type : 'POST',  
      data : JSON.stringify({  
        code : code
      }),
      context: this,
      contentType : "application/json", 
      success : function(data) {
        if (data.code == '1'){
          let currentDate = new Date()
          currentDate.setTime(currentDate.getTime() + data.content.expiredAt * 1000)
          loginUtils.setLoginUser({
            expireTime: currentDate.getTime(),
            token: data.content.token
          })
          this.loadingText = "Validation Successful, will redirect to Home page in 3 seconds"
          setTimeout(function(){
            window.location.href = "./home.html";
          }, 1000);
        } else {
          this.loading = false;
          this.$notify.error({
            title: 'Failure',
            message: 'Validation failure, please check your validation url.',
            duration: 5000
          })
        }

        
      },  
      error : function(data) {
        this.validateionForm.code = "";
        this.$notify.error({
          title: 'Failed',
          message: 'Validation failure, please check your validation url.',
          duration: 5000
        })
      },  
      dataType : 'json' 
    })  
  },

  methods: {
    onValidate() {
      
    },
    redirectToHome() {
      window.location.href = "./home.html";
    }
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
