import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './../../meebid.css'
import './../../bootstrap-3.3.7-dist/css/bootstrap.min.css'
import MeebidButton from './../../component/button/meebidButton.vue'
import MeebidTypeahead from './../../component/typeahead/meebidTypeahead.vue'
import MeebidSearchTypeahead from './../../component/typeahead/meebidSearchTypeahead.vue'
import MeebidDropdown from './../../component/dropdown/meebidDropdown.vue'
import MeebidBusyIndicator from './../../component/busyindicator/meebidBusyIndicator.vue'
import MeebidCategoryDialog from './../../component/dialog/meebidCategoryDialog.vue'
import App from './App.vue'

Vue.use(ElementUI)
Vue.component(MeebidButton.name, MeebidButton);
Vue.component(MeebidDropdown.name, MeebidDropdown);
Vue.component(MeebidTypeahead.name, MeebidTypeahead);
Vue.component(MeebidSearchTypeahead.name, MeebidSearchTypeahead);
Vue.component(MeebidBusyIndicator.name, MeebidBusyIndicator);
Vue.component(MeebidCategoryDialog.name, MeebidCategoryDialog);

//Vue.use(MeebidButton);

var appVue = new Vue({
  el: '#app',
  render: h => h(App)
});
