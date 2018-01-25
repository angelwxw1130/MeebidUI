//cn.js

import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
    meebid: {
        common: {
            MSG_FORGET_PASSWORD_LINK_TEXT: "Forget your password?"
        },
        upload: {
        	deleteTip: "按回车删除"
        },
        alertMessage: {
        	MSG_LOGIN_ACCOUNT_NOT_EXIST: "账号不存在，请再次尝试",
            MSG_LOGIN_PASSWORD_INCORRECT: "密码错误，请再次尝试",
        	MSG_PROFILE_ACCOUNT_NOT_ACTIVATE: "Account hasn't been activated, please check your email and activate your account",
        	MSG_PROFILE_ACCOUNT_NOT_APPROVE: "Account hasn't been approved, please upload license and ask administrator for approval",
            MSG_FORGET_PASSWORD_SEND_EMAIL_SUCCESS: "We have sent an email to your account for reseting password, please check your mail account.",
            MSG_RESET_PASSWORD_SUCCESS: "Change password successful! Redirect to home in 5 seconds."
        },
        forgetPassword: {
            MSG_FORGET_PASSWORD_HEADER_TEXT: "Send an email to reset your password"
        },
        resetPassword: {
            MSG_RESET_PASSWORD_HEADER_TEXT: "Please reset and confirm your passowrd"
        }
    },

    ...zhLocale
}

export default cn;