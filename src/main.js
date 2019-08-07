import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index'
import FastClick from 'fastclick'
import i18n from '@/lang/index'
import VueLazyload from 'vue-lazyload'
import './utils/create-api'
import './utils/boost' // 拓展方法
// import './mock/index' // mockjs 不支持blob对象

import '@/assets/styles/css/icon.css'
import 'normalize.css'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('@/assets/images/loading.gif'),
  // error: require('@/assets/images/load_image_error.png'),
  attempt: 1
})
Vue.config.productionTip = false

FastClick.attach(document.body)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
