// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import axios from 'axios'
import moment from 'moment'

import App from './App'
import Login from './components/Login'
import Search from './components/Search'
import Result from './components/Result'

import { AlertPlugin, ToastPlugin, LoadingPlugin } from 'vux'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

Vue.use(VueRouter)

const routes = [{
  name: 'login',
  path: '/',
  component: Login
},
{
  name: 'search',
  path: '/search',
  component: Search
},
{
  name: 'result',
  path: '/result/:plate',
  component: Result
}]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

axios.defaults.withCredentials = true
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')

Vue.filter('date', function (date) {
  return moment(date).format('YYYY-MM-DD HH:mm')
})

Vue.filter('diffHour', function (date) {
  var diffHours = moment().diff(moment(date), 'hour')
  if (diffHours < 1) {
    return '1小时内'
  } else {
    return diffHours + '小时前'
  }
})

Vue.filter('diffHourColor', function (date) {
  var diffHours = moment().diff(moment(date), 'hour')
  if (diffHours <= 5) {
    return 'success'
  } else if (diffHours <= 12) {
    return 'warning'
  } else {
    return 'danger'
  }
})
