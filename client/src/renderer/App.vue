<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'green-channel'
  }
</script>

<style>
  body{
     margin: 0;
  }
  .action-bar {
    margin-bottom: 5px;
    text-align: center;
  }
  .el-tabs__header {
     margin: 0;
  }
  .el-tabs__content {
     padding: 5px
  }
  .el-dialog__body {
    padding: 30px 20px 10px;
  }
  .pull-left {
    float: left;
  }
  .search-date {
    width: 200px;
  }
  .search-plate {
    margin-left: 10px;
    width: 200px;
  }
  .search-confirmed {
    margin-left: 10px;
  }
  .data-table {
    width: 1190px;
    height: 584px;
  }
  .footer {
    margin-top: 5px;
  }
  .pagination {
    float: left;
  }
  .download {
    float: right;
  }
  .download-btn {
    margin-left: 5px;
  }
</style>
