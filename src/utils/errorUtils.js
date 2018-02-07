import { MessageBox } from 'element-ui';
import loginUtils from './loginUtils'
export default {
  requestError (data) {
    if (data.status === 401){
      loginUtils.setLoginUser();
    }
    if (data && data.responseJSON && data.responseJSON.msg){
      MessageBox.alert(data.responseJSON.msg, "Error", {
        confirmButtonText: 'Close',
        type: 'warning',
        callback: action => {
          window.location.href = "./home.html";
        }
      });
    } else {
      MessageBox.alert(data, "Error", {
        confirmButtonText: 'Close',
        type: 'warning'
      });
    }
  },
  requestDataError (data) {
    MessageBox.alert(data.msg, "Error", {
      confirmButtonText: 'Close',
      type: 'warning',
      center: true
    });
  }
}
