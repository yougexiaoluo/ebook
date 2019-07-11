import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index'

import '@/assets/styles/css/icon.css'
import 'normalize.css'
// import '@/assets/fonts/family/daysOne.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
