import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ImageMatching from './components/ImageMatching/ImageMatching.vue'
import ProductsMatchingTest from './components/ProductsMatching/ProductsMatchingTest.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/image-matching',
      name: 'ImageMatching',
      component: ImageMatching
    },
    {
      path: '/products-matching-test',
      name: 'ProductsMatchingTest',
      component: ProductsMatchingTest
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
