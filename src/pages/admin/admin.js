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
import MeebidHeader from './../../component/header/MeebidHeader.vue'
import MeebidBusyIndicator from './../../component/busyindicator/meebidBusyIndicator.vue'
import MeebidTooltip from './../../component/tooltip/meebidTooltip.vue'
import MeebidCategoryDialog from './../../component/dialog/meebidCategoryDialog.vue'
import MeebidUpload from './../../component/upload/meebidUpload.vue'
import MeebidTextEditor from './../../component/texteditor/MeebidTextEditor.vue'
import MeebidNumberInput from './../../component/numberinput/meebidNumberInput.vue'
import MeebidRegisterDialog from './../../component/dialog/meebidRegisterDialog.vue'
import App from './App.vue'
import loginUtils from './../../utils/loginUtils'
import meebidUtils from './../../utils/meebidUtils'
import errorUtils from './../../utils/errorUtils'
import { MessageBox } from 'element-ui'
import i18n from './../../i18n/i18n'



Vue.use(ElementUI)

Vue.component(MeebidButton.name, MeebidButton);
Vue.component(MeebidDropdown.name, MeebidDropdown);
Vue.component(MeebidTypeahead.name, MeebidTypeahead);
Vue.component(MeebidSearchTypeahead.name, MeebidSearchTypeahead);
Vue.component(MeebidDropdown.name, MeebidDropdown);
Vue.component(MeebidHeader.name, MeebidHeader);
Vue.component(MeebidBusyIndicator.name, MeebidBusyIndicator);
Vue.component(MeebidTooltip.name, MeebidTooltip);
Vue.component(MeebidCategoryDialog.name, MeebidCategoryDialog);
Vue.component(MeebidUpload.name, MeebidUpload);
Vue.component(MeebidTextEditor.name, MeebidTextEditor);
Vue.component(MeebidNumberInput.name, MeebidNumberInput);
Vue.component(MeebidRegisterDialog.name, MeebidRegisterDialog);



//Vue.use(MeebidButton);


var loginUser = loginUtils.getLoginUser();
if (loginUser.token){
	 jquery.ajax({  
         url : "/api/user/profile",  
         type : 'GET',
         headers: {
         	token: loginUser.token
         },
         success : function(data) {

         	if (data.code == 1){
				//var categoryItems = data.content.categories;
				//for (var i = 0; i < categoryItems.length; i++){
					//categoryItems[i].selected = false;
		        //}
                var user = data.content.user;
                if (!user.contact_users) {
                    user.contact_users = [];
                }
                meebidUtils.refreshRegions(data.content.regions);

                if (data.content.addresses && data.content.addresses.length){
                    for (var i = 0; i < data.content.addresses.length; i++){
                        data.content.addresses[i].isDefault = false;
                    }
                }
                user.originalContactUsers = [].concat(user.contact_users);
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
	window.location.href = "./home.html";
}
