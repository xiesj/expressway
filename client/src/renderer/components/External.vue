<template>
  <div>
    <div class="action-bar">
      <el-row>
        <el-col :span="6">
          <el-upload class="pull-left" ref="import" :action="externalImportUrl" :with-credentials="true" :auto-upload="true" :show-file-list="false"
                     :on-success="importSuccess">
            <el-button slot="trigger" type="info" icon="upload">导入外部数据</el-button>
          </el-upload>
        </el-col>
        <el-col :span="12">
          <el-date-picker class="search-date" v-model="searchDate" @change="handleSearch" type="date" placeholder="选择操作日期"></el-date-picker>
          <el-input class="search-plate" placeholder="输入车牌号数字后三位" icon="search" v-model="searchPlate" @change="handleSearch" :on-icon-click="handleSearch"></el-input>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </div>
    <el-table class="data-table" :data="list" :height="550" :width="1190" v-loading.body="loading" border>
      <el-table-column label="车牌">
        <template scope="scope">
          <el-popover placement="right" title="详情" width="300" trigger="hover">
            <el-row>
              <el-col :span="8">操作时间</el-col>
              <el-col :span="16">{{scope.row.operationTime | date}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">班次</el-col>
              <el-col :span="16">{{scope.row.workShift}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">原始操作时间</el-col>
              <el-col :span="16">{{scope.row.origOperationTime}}</el-col>
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
              <el-col :span="8">免费金额</el-col>
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
      <el-table-column label="操作时间">
        <template scope="scope">
          <span>{{ scope.row.operationTime | date }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enterStation" label="入口站"></el-table-column>
      <el-table-column prop="exitStation" label="出口站"></el-table-column>
      <el-table-column prop="category" label="货物种类"></el-table-column>
      <el-table-column prop="freeAmount" label="免费金额"></el-table-column>
      <el-table-column prop="operator" label="验货员"></el-table-column>
    </el-table>
    <el-pagination class="pagination"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="20"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import Config from '../config'
  export default {
    data () {
      return {
        externalImportUrl: Config.api + '/external/import',
        searchDate: '',
        searchPlate: '',
        loading: false,
        list: [],
        total: 0,
        page: 1,
        editFormDialogVisible: false,
        editFormLabelWidth: '50px',
        editForm: {
          _id: '',
          id: '',
          name: '',
          age: '',
          phone: '',
          password: ''
        }
      }
    },
    methods: {
      loadList () {
        this.loading = true
        this.$http.post(Config.api + '/external/list', {
          page: this.page,
          date: this.searchDate,
          plate: this.searchPlate
        })
          .then(resp => {
            this.list = resp.data.list
            this.total = resp.data.total
            this.loading = false
          })
      },
      handleSearch () {
        this.loadList()
      },
      handleCurrentChange (val) {
        this.page = val
        this.loadList()
      },
      handleDetail (index, row) {
        Object.assign(this.$data.editForm, row)
        this.editFormDialogVisible = true
      },
      handleEdit (index, row) {
        Object.assign(this.$data.editForm, row)
        this.editFormDialogVisible = true
      },
      handleDelete (index, row) {
        this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('delete user', row._id)
          this.$http.delete(Config.api + '/users/' + row._id)
            .then(resp => {
              this.users.splice(index, 1)
              this.$message.success('删除成功!')
            })
            .catch(() => {
              this.$message.error('删除失败!')
            })
        }).catch(() => {
        })
      },
      handleImport (file) {
        this.$refs.import.abort(file)
      },
      importSuccess (response) {
        if (response.error) {
          if (response.error.code === 11000) {
            this.$message.warning('导入完成, 存在重复数据, 已被忽略!')
          } else {
            this.$message.error('数据导入错误, 请检查文件格式或联系管理员!')
          }
        } else if (response.inserted) {
          this.$message.success('成功导入' + response.inserted + '数据!')
        } else {
          this.$message.error('数据导入异常, 请检查文件格式或联系管理员!')
        }
        this.loadList()
      }
    },
    mounted () {
      this.loadList()
    }
  }
</script>
