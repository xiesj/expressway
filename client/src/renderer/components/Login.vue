<template>
  <div id="login-wrapper">
    <img id="logo" src="~@/assets/logo.png">
    <main>
      <div class="left-side">
        <div class="items">
          <div class="item">
            <div class="name">科学</div>
            <div class="value"></div>
          </div>
          <div class="item">
            <div class="name">合理</div>
            <div class="value"></div>
          </div>
          <div class="item">
            <div class="name">管用</div>
            <div class="value"></div>
          </div>
        </div>
      </div>

      <div class="right-side">
        <div class="login-form">
          <el-form :label-position="'top'" :model="loginForm" :rules="loginFormRules" ref="loginForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="工号" prop="id">
              <el-input type="text" v-model="loginForm.id" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import Config from '../config'

  export default {
    data () {
      var validateId = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入工号'))
        } else {
          callback()
        }
      }
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        focusPassword: false,
        loginForm: {
          id: '',
          password: ''
        },
        loginFormRules: {
          id: [
            { validator: validateId, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ]
        }
      }
    },
    name: 'login',
    components: { },
    directives: {
      focus: {
        inserted: function (el, { value }) {
          if (value) {
            el.focus()
          }
        }
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(Config.api + '/auth/login', {
              id: this.loginForm.id,
              password: this.loginForm.password
            }).then((resp) => {
              if (!resp.data.error) {
                this.$router.push('home')
              } else {
                this.$notify.error({
                  title: '登录失败',
                  message: '工号与密码不匹配'
                })
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style>

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #login-wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    padding: 60px 80px;
    width: 100vw;
    height: 100vh;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .login-form {
    margin-top: 20px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 6px;
  }

</style>
