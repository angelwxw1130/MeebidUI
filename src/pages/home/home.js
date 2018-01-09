import Vue from 'vue'
import ElementUI from 'element-ui'
import jquery from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'
import './../../meebid.css'
import './../../bootstrap-3.3.7-dist/css/bootstrap.min.css'
import MeebidButton from './../../component/button/meebidButton.vue'
import MeebidTypeahead from './../../component/typeahead/meebidTypeahead.vue'
import MeebidSearchTypeahead from './../../component/typeahead/meebidSearchTypeahead.vue'
import MeebidDropdown from './../../component/dropdown/meebidDropdown.vue'
import MeebidBusyIndicator from './../../component/busyindicator/meebidBusyIndicator.vue'
import MeebidPageList from './../../component/homepage/meebidHomePageList.vue'
import MeebidHomePageListItem from './../../component/homepage/meebidHomePageListItem.vue'
import MeebidCategoryDialog from './../../component/dialog/meebidCategoryDialog.vue'
import App from './App.vue'
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import { MessageBox } from 'element-ui';

Vue.use(ElementUI)
Vue.component(MeebidButton.name, MeebidButton);
Vue.component(MeebidDropdown.name, MeebidDropdown);
Vue.component(MeebidTypeahead.name, MeebidTypeahead);
Vue.component(MeebidSearchTypeahead.name, MeebidSearchTypeahead);
Vue.component(MeebidBusyIndicator.name, MeebidBusyIndicator);
Vue.component(MeebidHomePageListItem.name, MeebidHomePageListItem);
Vue.component(MeebidPageList.name, MeebidPageList);
Vue.component(MeebidCategoryDialog.name, MeebidCategoryDialog);


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
         		var appVue = new Vue({
					el: '#app',
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
	  render: h => h(App),
	  
	});
}


