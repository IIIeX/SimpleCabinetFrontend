import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Home
  },
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/currentuser',
    name: 'CurrentUser',
    component: () => import('../views/CurrentUser.vue')
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: () => import('../views/RegisterUser.vue')
  },
  {
    path: '/user/name/:username',
    name: 'UserByUsername',
    props: true,
    component: () => import('../views/UserByUsername.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
