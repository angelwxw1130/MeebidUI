<template>
  <div id="app" class="meebid">
    <div id="header" class="meebidAdminHeader">
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home" :button-click="redirectToHome">
        </meebid-button>
      </div>
    </div>
    <div id="content" class="meebidAdminContentWrapper" >
      <el-container class="meebidValidationPageContainer meebidPaddingTopMedium">
        <el-main>
          <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">Forget Password</div>
          <div class="meebidRegisterHeaderLabel">{{$t('meebid.forgetPassword.MSG_FORGET_PASSWORD_HEADER_TEXT')}}</div>
          <el-form ref="forgetPasswordFormRef" :model="forgetPasswordForm" label-width="180px" class="meebidPaddingTopMedium">
            <el-form-item label="Email Account" prop="email">
              <el-input v-model="forgetPasswordForm.email" placeholder="Please input your email account"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSend">SEND EMAIL</el-button>
            </el-form-item>
          </el-form>
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
      forgetPasswordForm: {
        email: ""
      },
      loginUser: loginUtils.getLoginUser()
    }
  },
  mounted() {
    var me = this;    
  },

  methods: {
    onSend() {
      $.ajax({
        type: "POST",
        url: "/api/email/send",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify({
          email: this.forgetPasswordForm.email
        }),
        success(data) {
          if (data.code === 1){
            this.$notify({
              type: 'success',
              title: 'Success',
              message: data.msg,
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: 'Failure',
              message: data.msg,
              duration: 5000
            })
          }
          
        },
        error() {
          this.$notify.error({
            title: 'Failure',
            message: 'Send Forget Password Email failure',
            duration: 5000
          })
        }
      })
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
