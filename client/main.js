// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'// 1.4'element-ui/lib/theme-default/index.css'

import router from './router'
import Session from './util/session'

const session = new Session()
let vm ;

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueResource)

Vue.http.interceptors.push((request, next) => {
  // 请求发送前的处理逻辑
  const jwtToken = session.get('token');
  if (jwtToken) {
    request.headers.set('Authorization', jwtToken) ;
  } else {
    delete request.headers.Authorization;
  }
  next((response) => {
    // 请求发送后的处理逻辑
    if (response.body.code === 103) {
    // 当 Token 已经失效时，清空所有保存在 session 的数据
      session.clear();
      router.replace('/login')
      vm.$notify.info({ title: '提示', message: response.data.msg, duration: 2000 })
      return false
    }
    return response
  })
})

vm = new Vue({ router }).$mount('#app')
