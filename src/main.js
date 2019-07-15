import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index'
import FastClick from 'fastclick'
import i18n from '@/lang/index'

import '@/assets/styles/css/icon.css'
import 'normalize.css'

Vue.config.productionTip = false

FastClick.attach(document.body)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
