import Vue from 'vue'
import ElementUI from 'element-ui'
import jquery from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'
import './../../meebidTheme/index.css'
import './../../meebid.css'
import './../../bootstrap-3.3.7-dist/css/bootstrap.min.css'
import meebidConstant from './../../constant/meebidConstants'
import MeebidButton from './../../component/button/meebidButton.vue'
import MeebidTypeahead from './../../component/typeahead/meebidTypeahead.vue'
import MeebidSearchTypeahead from './../../component/typeahead/meebidSearchTypeahead.vue'
import MeebidDropdown from './../../component/dropdown/meebidDropdown.vue'
import MeebidBusyIndicator from './../../component/busyindicator/meebidBusyIndicator.vue'
import MeebidCategoryDialog from './../../component/dialog/meebidCategoryDialog.vue'
import MeebidUpload from './../../component/upload/meebidUpload.vue'
import App from './App.vue'
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import { MessageBox } from 'element-ui'
import i18n from './../../i18n/i18n'


Vue.use(ElementUI)

Vue.component(MeebidButton.name, MeebidButton);
Vue.component(MeebidDropdown.name, MeebidDropdown);
Vue.component(MeebidTypeahead.name, MeebidTypeahead);
Vue.component(MeebidSearchTypeahead.name, MeebidSearchTypeahead);
Vue.component(MeebidBusyIndicator.name, MeebidBusyIndicator);
Vue.component(MeebidCategoryDialog.name, MeebidCategoryDialog);
Vue.component(MeebidUpload.name, MeebidUpload);



//Vue.use(MeebidButton);

var loginUser = loginUtils.getLoginUser();
if (loginUser.token){
	 jquery.ajax({  
         url : "/api/user/profile",  
         type : 'GET',
         headers: {
         	token: loginUser.token
         },
         contentType : "application/json", 
         success : function(data) {

         	if (data.code == 1){
				var categoryItems = data.content.categories;
				for (var i = 0; i < categoryItems.length; i++){
					categoryItems[i].selected = false;
		        }
        		var appVue = new Vue({
					el: '#app',
                    i18n,
					render: h => h(App),
					data: data.content
				});
         	} else {
         		errorUtils.requestDataError(data)
         	}
			
         },  
         error : function(data) {  
         	errorUtils.requestError(data)
         },  
         dataType : 'json' 
     }) 
} else {
	var appVue = new Vue({
	  el: '#app',
      i18n,
	  render: h => h(App),
	  
	});
}
