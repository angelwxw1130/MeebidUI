export default {
  getLoginUser () {
    let loginUser = window.localStorage.getItem("meebid") || {
      isLogin: false
    }
    return loginUser
  },
  setLoginUser (userInfo) {
    if (userInfo){
      window.localStorage.setItem("meebid", {
        isLogin: true,
        userId: userInfo.userId,
        token: userInfo.token
      })
      
    }
    
  }
}
