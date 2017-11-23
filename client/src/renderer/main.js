import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
import router from './router'
import store from './store'

Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

axios.defaults.withCredentials = true
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

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

Vue.filter('distanceHour', function (date, date2) {
  var diffHours = moment(date2).diff(moment(date), 'hour')
  return diffHours + '小时'
})

Vue.filter('distanceHourShow', function (date, date2) {
  var diffHours = moment(date2).diff(moment(date), 'hour')
  if (diffHours < 6) {
    return 'display: none'
  }
})
