<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="免费车查询" name="search">
        <search></search>
      </el-tab-pane>
      <el-tab-pane label="站内数据核对" name="internal">
        <internal></internal>
      </el-tab-pane>
      <el-tab-pane label="外部数据管理" name="external">
        <external></external>
      </el-tab-pane>
      <el-tab-pane label="账号管理" name="users">
        <users></users>
      </el-tab-pane>
      <el-tab-pane label="个人信息" name="logout">
        <router-link to="login"><el-button type="info">退出登录</el-button></router-link>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import users from './Users.vue'
  import external from './External.vue'
  import internal from './Internal.vue'
  import search from './Search.vue'
  export default {
    data () {
      return {
        activeName: 'search'
      }
    },
    components: { users, external, internal, search },
    methods: {
      handleClick (tab, event) {
      }
    }
  }
</script>
