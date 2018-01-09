export default {
  getLoginUser () {
    let expireTime = window.localStorage.getItem("meebidLoginUserExpireTime")
    let token = window.localStorage.getItem("meebidLoginUserToken")
    let loginUser = {
      isLogin: false
    }
    let currentDate = new Date()
    if (expireTime){
      let expireDate = new Date(parseInt(expireTime))
      if (expireDate.getTime() > currentDate.getTime()){
        loginUser = {
          expireTime: expireTime,
          token: token
        }  
      }   
    }
    return loginUser
  },
  setLoginUser (userInfo) {
    if (userInfo){
      window.localStorage.setItem("meebidLoginUserExpireTime", userInfo.expireTime)
      window.localStorage.setItem("meebidLoginUserToken", userInfo.token)
    } else {
      window.localStorage.removeItem("meebidLoginUserExpireTime")
      window.localStorage.removeItem("meebidLoginUserToken")
    }
    
  }
}
