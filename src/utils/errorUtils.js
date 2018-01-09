import { MessageBox } from 'element-ui';

export default {
  requestError (data) {
    if (data && data.responseJSON && data.responseJSON.msg){
      MessageBox.alert(data.responseJSON.msg, "Error", {
        confirmButtonText: 'Close',
        type: 'warning'
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
