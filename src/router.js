import Vue from 'vue'
import Router from 'vue-router'
import Preferences from './views/Preferences.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'preferences',
      component: Preferences
    },
     {
         path: '/map',
         name: 'mapView',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "map" */ './views/Map.vue')
     }
  ]
})
