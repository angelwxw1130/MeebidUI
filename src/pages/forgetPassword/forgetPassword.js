import Vue from 'vue'
import ElementUI from 'element-ui'
import jquery from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'
import './../../meebidTheme/index.css'
import './../../meebid.css'
import './../../bootstrap-3.3.7-dist/css/bootstrap.min.css'
import meebidConstant from './../../constant/meebidConstants'
import MeebidButton from './../../component/button/meebidButton.vue'
import MeebidBusyIndicator from './../../component/busyindicator/meebidBusyIndicator.vue'
import App from './App.vue'
import i18n from './../../i18n/i18n'

Vue.use(ElementUI);
Vue.component(MeebidButton.name, MeebidButton);
Vue.component(MeebidBusyIndicator.name, MeebidBusyIndicator);


var appVue = new Vue({
  el: '#app',
  i18n,
  render: h => h(App),
  
});
