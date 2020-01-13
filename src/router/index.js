import Vue from 'vue'
import VueRouter from 'vue-router'
import Collections from '../views/Collections.vue'
import About from '../views/About.vue'
import Map from "../views/Map";
import SimpleFlights from "../views/SimpleFlights";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: SimpleFlights
  },
  {
    path: '/collections',
    name: 'collections',
    component: Collections
  },
  {
    path: '/map',
    name: 'map',
    component: Map
  },
  {
    path: '/simple',
    name: 'simple',
    component: SimpleFlights
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: About
  }
];

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
