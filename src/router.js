import Vue from 'vue'
import Router from 'vue-router'
import Start from './views/Start.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: Start
    },
     {
         path: '/preferences',
         name: 'preferences',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "preferences" */ './views/Preferences.vue')
     },
      {
          path: '/map',
          name: 'mapView',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "map" */ './views/Map.vue')
      },
      {
          path: '/subscription',
          name: 'subscription',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "map" */ './views/Subscription.vue')
      }
  ]
})
