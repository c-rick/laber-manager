import VueRouter from 'vue-router'
import SignIn from './components/SignIn.vue'
import Label from './components/Label.vue'

import Session from './util/session'
const session = new Session()

const isLogin = () => !!session.get('token')

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/login',
      component: SignIn
    },
    {
      path: '/',
      component: Label
    }
  ]
})

router.beforeEach((to, from, next) => {
  const pathLogin = to.path === '/login' || to.path === '/'
  if (isLogin()) {
    pathLogin ? to.path === '/login' ? next('/') : next() : next('/login')
  }
  else {
    to.path === '/login' ? next() : next('/login')
  }
})

export default router
