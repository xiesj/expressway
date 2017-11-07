<template>
  <div>
    <div class="action-bar">
      <el-row>
        <el-col :span="6">
          <el-upload ref="import" :action="externalImportUrl" :with-credentials="true" :auto-upload="true" :show-file-list="false"
                     :on-success="importSuccess">
            <el-button slot="trigger" type="info" icon="upload">导入外部数据</el-button>
          </el-upload>
        </el-col>
        <el-col :span="12">
          <el-date-picker class="search-date" v-model="searchDate" @change="handleSearch" type="date" placeholder="选择操作日期"></el-date-picker>
          <el-input class="search-plate" placeholder="输入车牌号数字后三位" icon="search" v-model="searchPlate" @change="handleSearch" :on-icon-click="handleSearch"></el-input>
          <el-checkbox class="search-confirmed" v-model="searchConfirmed" @change="handleSearch">搜索已确认数据</el-checkbox>
        </el-col>
        <el-col :span="6">
        </el-col>
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
      <el-table-column prop="category" width="100" label="货物"></el-table-column>
      <el-table-column prop="freeAmount" width="100" label="金额"></el-table-column>
      <el-table-column prop="confirmAt" label="确认时间">
        <template scope="scope">
          <span v-if="scope.row.confirmAt">{{ scope.row.confirmAt | date }}</span>
          <span v-else="">未确认</span>
        </template>
      </el-table-column>
      <el-table-column prop="confirmBy" width="100" label="确认人"></el-table-column>
    </el-table>
    <div class="footer">
      <el-pagination class="pagination"
                     @current-change="handleCurrentChange"
                     :current-page="page"
                     :page-size="20"
                     layout="total, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
      <div class="download">
        <el-button class="download-btn" size="small" type="info" @click="exportPage">导出本页</el-button>
        <el-button v-if="total < 1000" class="download-btn" size="small" type="info" @click="exportAll">导出全部</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  import moment from 'moment'
  import xlsx from 'node-xlsx'
  import Config from '../config'
  import ElCheckbox from '../../../node_modules/element-ui/packages/checkbox/src/checkbox'

  const { dialog } = require('electron').remote

  export default {
    components: {ElCheckbox},
    data () {
      return {
        externalImportUrl: Config.api + '/external/import',
        searchDate: '',
        searchPlate: '',
        searchConfirmed: false,
        loading: false,
        list: [],
        total: 0,
        limit: 20,
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
          limit: this.limit,
          page: this.page,
          date: this.searchDate,
          plate: this.searchPlate,
          confirmed: this.searchConfirmed
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
          this.loading = true
          this.$http.delete(Config.api + '/users/' + row._id)
            .then(resp => {
              this.users.splice(index, 1)
              this.$message.success('删除成功!')
              this.loading = false
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
      },
      exportPage () {
        var data = [['车牌', '操作时间', '入口站', '出口站', '货物', '金额', '确认时间', '确认人']]
        this.list.forEach(row => {
          data.push([
            row.plateId,
            moment(row.operationTime).format('YYYY-MM-DD HH:mm'),
            row.enterStation,
            row.exitStation,
            row.category,
            row.freeAmount,
            row.confirmAt ? moment(row.confirmAt).format('YYYY-MM-DD HH:mm') : '',
            row.confirmBy])
        })

        var fileName = '搜索结果'
        if (this.searchConfirmed) {
          fileName = '确认记录'
        }
        if (this.searchPlate) {
          fileName += '-' + this.searchPlate
        }
        if (this.searchDate) {
          fileName += '-' + moment(this.searchDate).format('YYYYMMDD')
        }
        fileName += '-' + this.page

        fileName += '.xlsx'

        var buffer = xlsx.build([{data: data}])

        dialog.showSaveDialog({
          defaultPath: fileName
        }, filePath => {
          if (filePath) {
            fs.writeFile(filePath, buffer, err => {
              if (err) throw err
              this.$message.success('导出成功!')
            })
          }
        })
      },
      exportAll () {
        this.loading = true
        this.$http.post(Config.api + '/external/list', {
          limit: 'all',
          date: this.searchDate,
          plate: this.searchPlate,
          confirmed: this.searchConfirmed
        })
          .then(resp => {
            this.loading = false
            var data = [['车牌', '操作时间', '入口站', '出口站', '货物', '金额', '确认时间', '确认人']]
            resp.data.list.forEach(row => {
              data.push([
                row.plateId,
                moment(row.operationTime).format('YYYY-MM-DD HH:mm'),
                row.enterStation,
                row.exitStation,
                row.category,
                row.freeAmount,
                row.confirmAt ? moment(row.confirmAt).format('YYYY-MM-DD HH:mm') : '',
                row.confirmBy])
            })

            var fileName = '搜索结果'
            if (this.searchConfirmed) {
              fileName = '确认记录'
            }
            if (this.searchPlate) {
              fileName += '-' + this.searchPlate
            }
            if (this.searchDate) {
              fileName += '-' + moment(this.searchDate).format('YYYYMMDD')
            }

            fileName += '.xlsx'

            var buffer = xlsx.build([{data: data}])

            dialog.showSaveDialog({
              defaultPath: fileName
            }, filePath => {
              if (filePath) {
                fs.writeFile(filePath, buffer, err => {
                  if (err) throw err
                  this.$message.success('导出成功!')
                })
              }
            })
          })
      }
    },
    mounted () {
      this.loadList()
    }
  }
</script>
