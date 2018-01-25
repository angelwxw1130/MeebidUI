webpackJsonp([5],{120:function(e,s,r){"use strict";var t=r(14),a=r.n(t),o=r(3),n=r.n(o),i=r(11),d=r(41),l=r(6);s.a={data:function(){var e=this;return{resetPasswordFormRules:{password:[{required:!0,message:"Please input password.",trigger:"blur"},{min:6,max:255,message:"Password cannot be less than 6 characters",trigger:"blur"},{validator:function(s,r,t){""!==e.resetPasswordForm.password&&""!==e.resetPasswordForm.confirmPassword&&e.$refs.resetPasswordFormRef.validateField("confirmPassword"),t()},trigger:"blur"}],confirmPassword:[{required:!0,message:"Please input password again.",trigger:"blur"},{validator:function(s,r,t){r!==e.resetPasswordForm.password?t(new Error("Password does not match.")):t()},trigger:"blur"}]},resetPasswordForm:{password:"",confirmPassword:""},loginUser:i.a.getLoginUser()}},mounted:function(){},methods:{onReset:function(){var e=this,s=(window.location.search,d.a.getUrlParameter("code"));this.$refs.resetPasswordFormRef.validate(function(r){r&&n.a.ajax({type:"POST",url:"/api/user/password/reset",contentType:"application/json",context:e,headers:{token:e.loginUser.token},dataType:"json",data:a()({password:e.resetPasswordForm.password,code:s}),success:function(s){if(1===s.code){this.$message({type:"success",message:l.a.t("meebid.alertMessage.MSG_RESET_PASSWORD_SUCCESS")});var r=new Date;r.setTime(r.getTime()+1e3*s.content.expiredAt),i.a.setLoginUser({expireTime:r.getTime(),token:s.content.token}),setTimeout(function(){e.redirectToHome()},3e3)}else this.$notify.error({title:"Failure",message:s.msg,duration:5e3})},error:function(){this.$notify.error({title:"Failure",message:"Send Forget Password Email failure",duration:5e3})}})})},redirectToHome:function(){window.location.href="./home.html"}}}},266:function(e,s,r){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var t=r(2),a=r(7),o=r.n(a),n=r(3),i=(r.n(n),r(26)),d=(r.n(i),r(27)),l=(r.n(d),r(28)),m=(r.n(l),r(29)),c=(r.n(m),r(31)),u=r(32),p=r(267),w=r(6);t.default.use(o.a),t.default.component(c.a.name,c.a),t.default.component(u.a.name,u.a);new t.default({el:"#app",i18n:w.a,render:function(e){return e(p.a)}})},267:function(e,s,r){"use strict";function t(e){r(268)}var a=r(120),o=r(270),n=r(0),i=t,d=n(a.a,o.a,!1,i,null,null);s.a=d.exports},268:function(e,s,r){var t=r(269);"string"==typeof t&&(t=[[e.i,t,""]]),t.locals&&(e.exports=t.locals);r(12)("069f0726",t,!0)},269:function(e,s,r){s=e.exports=r(5)(!1),s.push([e.i,"body,html{margin:0}#app,body,html{height:100%}",""])},270:function(e,s,r){"use strict";var t=function(){var e=this,s=e.$createElement,r=e._self._c||s;return r("div",{staticClass:"meebid",attrs:{id:"app"}},[r("div",{staticClass:"meebidAdminHeader",attrs:{id:"header"}},[r("div",{staticClass:"meebidHeaderButtonToolbar"},[r("meebid-button",{attrs:{"wrapper-cls":"homeWrapper","button-type":"round",text:"Home","button-click":e.redirectToHome}})],1)]),e._v(" "),r("div",{staticClass:"meebidAdminContentWrapper",attrs:{id:"content"}},[r("el-container",{staticClass:"meebidValidationPageContainer meebidPaddingTopMedium"},[r("el-main",[r("div",{staticClass:"meebidLoginDialogLabel meebidRegisterHeaderLabel"},[e._v("Reset Password")]),e._v(" "),r("div",{staticClass:"meebidRegisterHeaderLabel"},[e._v(e._s(e.$t("meebid.resetPassword.MSG_RESET_PASSWORD_HEADER_TEXT")))]),e._v(" "),r("el-form",{ref:"resetPasswordFormRef",staticClass:"meebidPaddingTopMedium",attrs:{model:e.resetPasswordForm,rules:e.resetPasswordFormRules,"label-width":"180px"}},[r("el-form-item",{attrs:{label:"Password",prop:"password"}},[r("el-input",{attrs:{type:"password","auto-complete":"new-password"},model:{value:e.resetPasswordForm.password,callback:function(s){e.$set(e.resetPasswordForm,"password",s)},expression:"resetPasswordForm.password"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"Confirm Password",prop:"confirmPassword"}},[r("el-input",{attrs:{type:"password","auto-complete":"new-password"},model:{value:e.resetPasswordForm.confirmPassword,callback:function(s){e.$set(e.resetPasswordForm,"confirmPassword",s)},expression:"resetPasswordForm.confirmPassword"}})],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:e.onReset}},[e._v("RESET PASSWORD")])],1)],1)],1)],1)],1)])},a=[],o={render:t,staticRenderFns:a};s.a=o},41:function(e,s,r){"use strict";s.a={getUrlParameter:function(e){return decodeURIComponent((new RegExp("[?|&]"+e+"=([^&;]+?)(&|#|;|$)").exec(window.location.search)||[null,""])[1].replace(/\+/g,"%20"))||null}}}},[266]);
//# sourceMappingURL=resetPassword.js.map?d364fd753dc444a7513b