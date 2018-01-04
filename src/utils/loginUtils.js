export default {
  getLoginUser () {
    let loginUserId = window.localStorage.getItem("meebidLoginUserId")
    let loginUserToken = window.localStorage.getItem("meebidLoginUserToken")
    let loginUser = {
      isLogin: false
    }
    let currentDate = new Date()
    if (loginUserToken && loginUserToken > currentDate.getTime()){
      loginUser = {
        userId: loginUserId,
        token: loginUserToken
      }
    }
    return loginUser
  },
  setLoginUser (userInfo) {
    if (userInfo){
      window.localStorage.setItem("meebidLoginUserId", userInfo.userId)
      window.localStorage.setItem("meebidLoginUserToken", userInfo.token)
    } else {
      window.localStorage.removeItem("meebidLoginUserId")
      window.localStorage.removeItem("meebidLoginUserToken")
    }
    
  }
}
