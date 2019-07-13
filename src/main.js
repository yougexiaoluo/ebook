import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index'
import FastClick from 'fastclick'

import '@/assets/styles/css/icon.css'
import 'normalize.css'
// import '@/assets/fonts/family/daysOne.css'

Vue.config.productionTip = false
FastClick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
