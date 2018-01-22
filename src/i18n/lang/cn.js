//cn.js

import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
    message: {
        'upload': {
        	deleteTip: "按回车删除"
        },
        'alertMessage': {
        	MSG_LOGIN_ACCOUNT_NOT_EXIST: "账号不存在，请再次尝试",
        	MSG_PROFILE_ACCOUNT_NOT_ACTIVATE: "Account hasn't been activated, please check your email and activate your account",
        	MSG_PROFILE_ACCOUNT_NOT_APPROVE: "Account hasn't been approved, please upload license and ask administrator for approval"
        }
    },

    ...zhLocale
}

export default cn;