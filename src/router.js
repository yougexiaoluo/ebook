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
      redirect: '/store/shelf',
      component: () => import(/* webpackChunkName: 'store' */ '@/views/store/index.vue'),
      children: [
        {
          path: 'home',
          name: 'store-home',
          component: () => import(/* webpackChunkName: 'storeHome' */ '@/views/store/StoreHome.vue')
        },
        {
          path: 'detail',
          name: 'book-detail',
          component: () => import(/* webpackChunkName: 'detail' */ '@/views/store/StoreDetail.vue')
        },
        {
          path: 'list',
          name: 'store-list',
          component: () => import(/* webpackChunkName: 'list' */ '@/views/store/StoreList.vue')
        },
        {
          path: 'category',
          name: 'category',
          component: () => import(/* webpackChunkName: 'category' */ '@/views/store/StoreCategory.vue')
        },
        {
          path: 'shelf',
          name: 'store-shelf',
          component: () => import(/* webpackChunkName: 'shelf' */ '@/views/store/StoreShelf.vue')
        },
        {
          path: 'speaking',
          name: 'speaking',
          component: () => import(/* webpackChunkName: 'speaking' */ '@/views/store/StoreSpeaking.vue')
        }
      ]
    }
  ]
})
