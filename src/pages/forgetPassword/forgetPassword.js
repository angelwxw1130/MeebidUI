import Vue from 'vue'
import ElementUI from 'element-ui'
import jquery from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'
import './../../meebidTheme/index.css'
import './../../meebid.css'
import './../../bootstrap-3.3.7-dist/css/bootstrap.min.css'
import MeebidButton from './../../component/button/meebidButton.vue'
import MeebidDropdown from './../../component/dropdown/meebidDropdown.vue'
import MeebidBusyIndicator from './../../component/busyindicator/meebidBusyIndicator.vue'
import App from './App.vue'
import locale from 'element-ui/lib/locale/lang/en'


Vue.use(ElementUI, {locale});
Vue.component(MeebidButton.name, MeebidButton);
Vue.component(MeebidDropdown.name, MeebidDropdown);
Vue.component(MeebidBusyIndicator.name, MeebidBusyIndicator);


var appVue = new Vue({
  el: '#app',
  render: h => h(App),
  
});
