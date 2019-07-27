import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      redirect: '/store' // 路由重定向
    },
    {
      path: '/ebook',
      name: 'ebook',
      component: () => import(/* webpackChunkName: 'ebook' */ '@/views/ebook/index.vue'),
      children: [
        {
          path: ':fileName', // 可以直接写需要传递的参数(动态路由)
          name: 'EbooReader',
          component: () => import(/* webpackChunkName: 'EbookReader' */ '@/components/EbookReader/EbookReader.vue')
        }
      ]
    },
    {
      path: '/store',
      name: 'store',
      redirect: '/store/home',
      component: () => import(/* webpackChunkName: 'store' */ '@/views/store/index.vue'),
      children: [
        {
          path: 'home',
          name: 'store-home',
          component: () => import(/* webpackChunkName: 'storeHome' */ '@/views/store/StoreHome.vue')
        }
      ]
    }
  ]
})
