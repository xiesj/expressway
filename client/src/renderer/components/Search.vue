<template>
  <div>
    <div class="action-bar">
      <el-input class="search-plate" placeholder="输入车牌号数字后三位" icon="search" v-model="searchPlate"
                @change="handleSearch" :on-icon-click="handleSearch"></el-input>
    </div>
    <el-table class="data-table" :data="list" :height="584" v-loading.body="loading" border>
      <el-table-column label="车牌">
        <template scope="scope">
          <el-popover placement="right" title="详情" width="300" trigger="hover">
            <el-row>
              <el-col :span="8">班次</el-col>
              <el-col :span="16">{{scope.row.workShift}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">电子照片编号</el-col>
              <el-col :span="16">{{scope.row.pictureId}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">车牌照号</el-col>
              <el-col :span="16">{{scope.row.plateId}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">入口站</el-col>
              <el-col :span="16">{{scope.row.enterStation}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">出口站</el-col>
              <el-col :span="16">{{scope.row.exitStation}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">货物种类</el-col>
              <el-col :span="16">{{scope.row.category}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">操作时间</el-col>
              <el-col :span="16">{{scope.row.freeAmount}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">验货员</el-col>
              <el-col :span="16">{{scope.row.operator}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">监控员</el-col>
              <el-col :span="16">{{scope.row.supervisor}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">值班领导</el-col>
              <el-col :span="16">{{scope.row.leader}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">数据导入员</el-col>
              <el-col :span="16">{{scope.row.importer}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">数据导入时间</el-col>
              <el-col :span="16">{{scope.row.importTime | date}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">数据文件名</el-col>
              <el-col :span="16">{{scope.row.importFileName}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">数据表名</el-col>
              <el-col :span="16">{{scope.row.importSheetName}}</el-col>
            </el-row>
            <div slot="reference">
              <span>{{ scope.row.plateId }}</span>
              <el-button type="text"><i class="el-icon-information"></i></el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="240">
        <template scope="scope">
          <span>{{ scope.row.operationTime | date }}</span>
          <el-tag v-bind:type="scope.row.operationTime | diffHourColor">{{ scope.row.operationTime | diffHour}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enterStation" label="入口站"></el-table-column>
      <el-table-column prop="exitStation" label="出口站"></el-table-column>
      <el-table-column prop="category" label="种类"></el-table-column>
      <el-table-column prop="freeAmount" label="免费金额"></el-table-column>
      <el-table-column prop="operator" label="验货员"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Config from '../config'
  export default {
    data () {
      return {
        searchPlate: '',
        loading: false,
        list: []
      }
    },
    methods: {
      handleSearch () {
        if (this.searchPlate) {
          this.loading = true
          this.$http.post(Config.api + '/external/search', {
            plate: this.searchPlate
          })
            .then(resp => {
              this.list = resp.data.list
              this.loading = false
            })
        } else {
          this.$message.warning('请输入车牌!')
        }
      }
    },
    mounted () {
    }
  }
</script>
