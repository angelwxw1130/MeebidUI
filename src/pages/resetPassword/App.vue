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
          <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">Reset Password</div>
          <div class="meebidRegisterHeaderLabel">{{$t('meebid.resetPassword.MSG_RESET_PASSWORD_HEADER_TEXT')}}</div>
          <el-form ref="resetPasswordFormRef" :model="resetPasswordForm" :rules="resetPasswordFormRules" label-width="180px" class="meebidPaddingTopMedium">
            <el-form-item label="Password" prop="password">
              <el-input v-model="resetPasswordForm.password" type="password" auto-complete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input v-model="resetPasswordForm.confirmPassword" type="password" auto-complete="new-password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onReset">RESET PASSWORD</el-button>
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
import i18n from './../../i18n/i18n'
export default {
  data () {
    var validatePassword = (rule, value, callback) => {
      if (this.resetPasswordForm.password !== '' && this.resetPasswordForm.confirmPassword !== '') {
        this.$refs.resetPasswordFormRef.validateField('confirmPassword');
      }
      callback();
    };
    var validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.resetPasswordForm.password) {
        callback(new Error('Password does not match.'));
      } else {
        callback();
      }
    };
    return {
      resetPasswordFormRules: {
        password: [
          { required: true, message: 'Please input password.', trigger: 'blur' },
          { min: 6, max: 255, message: 'Password cannot be less than 6 characters', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Please input password again.', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      resetPasswordForm: {
        password: "",
        confirmPassword: ""
      },
      loginUser: loginUtils.getLoginUser()
    }
  },
  mounted() {
    var me = this;
  },
  methods: {
    onReset() {
      var me = this;
      var paramterStr = window.location.search;
      var code = urlUtils.getUrlParameter('code');
      this.$refs.resetPasswordFormRef.validate(function(isValid){
        if (isValid){
          $.ajax({
            type: "POST",
            url: "/api/user/password/reset",
            contentType : "application/json", 
            context: me,
            headers: {
              token: me.loginUser.token
            },
            dataType : 'json',
            data: JSON.stringify({
              password: me.resetPasswordForm.password,
              code: code
            }),
            success(data) {
              if (data.code === 1){
                this.$message({
                  type: 'success',
                  message: i18n.t('meebid.alertMessage.MSG_RESET_PASSWORD_SUCCESS')
                })
                let currentDate = new Date()
                currentDate.setTime(currentDate.getTime() + data.content.expiredAt * 1000)
                loginUtils.setLoginUser({
                  expireTime: currentDate.getTime(),
                  token: data.content.token
                });
                setTimeout(function(){
                  me.redirectToHome();
                }, 3000);
                
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
