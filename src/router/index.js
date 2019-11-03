import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  // scrollBehavior: function(to) {
  //   if (to.hash) {
  //     return {selector: to.hash}
  //   } else {
  //     return { x: 0, y: 0 }
  //   }
  // },
  // scrollBehavior (to) {
  //   if (to.hash) {
  //     return $('html,body').stop().animate({scrollTop: $(to.hash).offset().top }, 1000);
  //   } else {
  //     return $('html,body').stop().animate({scrollTop: 0 }, 500);
  //   }
  // }
})

export default router
