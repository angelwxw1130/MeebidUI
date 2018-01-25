import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
    meebid: {
        common: {
            MSG_FORGET_PASSWORD_LINK_TEXT: "Forget your password?"
        },
        upload: {
        	deleteTip: "Press enter to delete"
        },
        alertMessage: {
        	MSG_LOGIN_ACCOUNT_NOT_EXIST: "Account not exist, please try again.",
            MSG_LOGIN_PASSWORD_INCORRECT: "Incorrect password, please try again.",
        	MSG_PROFILE_ACCOUNT_NOT_ACTIVATE: "Account hasn't been activated, please check your email and activate your account",
        	MSG_PROFILE_ACCOUNT_NOT_APPROVE: "Account hasn't been approved, please upload license and ask administrator for approval",
            MSG_FORGET_PASSWORD_SEND_EMAIL_SUCCESS: "We have sent an email to your account for reseting password, please check your mail account.",
            MSG_RESET_PASSWORD_SUCCESS: "Change password successful! Redirect to home in 5 seconds.",
            MSG_ADMIN_USER_UPDATE_PROFILE_SUCCESS: "Profile information updated"
        },
        forgetPassword: {
            MSG_FORGET_PASSWORD_HEADER_TEXT: "Send an email to reset your password"
        },
        resetPassword: {
            MSG_RESET_PASSWORD_HEADER_TEXT: "Please reset and confirm your passowrd"
        }
    },
    ...enLocale
}

export default en;