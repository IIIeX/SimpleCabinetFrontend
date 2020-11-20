import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import config from '../config.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
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
    path: '/currentuser/security',
    name: 'UserSecuritySettings',
    component: () => import('../views/user/UserSecuritySettings.vue')
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: () => import('../views/RegisterUser.vue')
  },
  {
    path: '/shop',
    name: 'ShopProductsList',
    component: () => import('../views/shop/ShopProductsList.vue')
  },
  {
    path: '/devtools',
    name: 'DevTools',
    component: () => config.devtools ? import('../views/DevTools.vue') : import('../views/None.vue')
  },
  {
    path: '/user/name/:username',
    name: 'UserByUsername',
    props: true,
    component: () => import('../views/UserByUsername.vue')
  },
  {
    path: '/user/uuid/:uuid',
    name: 'UserByUUID',
    props: true,
    component: () => import('../views/UserByUUID.vue')
  },
  {

    path: '/cb/passwordreset/:id/:uuid',
    name: 'PasswordReset',
    props: true,
    component: () => import('../views/cb/PasswordReset.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
