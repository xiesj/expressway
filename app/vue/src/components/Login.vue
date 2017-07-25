<template>
  <div>
    <div class="banner">
      <img class="logo" src="../assets/logo.png">
      <h1> </h1>
    </div>
    <group title="登录">
      <x-input title="工号" v-model="id" required></x-input>
      <x-input title="密码" v-model="password" type="password" required></x-input>
    </group>
    <div style="padding:15px;">
      <x-button plain type="primary" @click.native="submitForm">登录</x-button>
    </div>
  </div>
</template>

<script>
import Config from '../config'
import { Toast, Group, Cell, XButton, XInput } from 'vux'

export default {
  components: {
    Toast,
    Group,
    Cell,
    XButton,
    XInput
  },
  data () {
    return {
      id: '',
      password: ''
    }
  },
  methods: {
    submitForm () {
      if (this.id && this.password) {
        this.$http.post(Config.api + '/auth/login', {
          id: this.id,
          password: this.password
        }).then((resp) => {
          if (!resp.data.error) {
            this.$router.push('search')
          } else {
            this.$vux.toast.text('工号和密码不能为空')
          }
        })
      } else {
        this.$vux.toast.text('工号和密码不能为空')
      }
    }
  }
}
</script>

<style>
.banner {
  text-align: center;
}
.logo {
  width: 300px;
}
</style>
