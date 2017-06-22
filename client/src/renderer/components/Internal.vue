<template>
  <div>
    <div class="action-bar">
      <el-row>
        <el-col :span="6">
          <el-upload class="pull-left" ref="import" :action="internalImportUrl" :with-credentials="true" :auto-upload="true" :show-file-list="false"
                     :on-success="importSuccess">
            <el-button slot="trigger" type="info" icon="upload2">导入站内数据</el-button>
          </el-upload>
        </el-col>
        <el-col :span="12">
          <el-date-picker class="search-date" v-model="searchDate" @change="handleSearch" type="date" placeholder="选择出口日期"></el-date-picker>
          <el-input class="search-plate" placeholder="输入车牌号数字后三位" icon="search" v-model="searchPlate" @change="handleSearch" :on-icon-click="handleSearch"></el-input>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </div>
    <el-table class="data-table" :data="list" :height="584" v-loading.body="loading" border>
      <el-table-column prop="plateId" label="车牌">
        <template scope="scope">
          <el-popover placement="right" title="详情" width="500" trigger="hover">
            <el-row>
              <el-col :span="8">入口站号</el-col>
              <el-col :span="16">{{scope.row.enterStation}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">入口车型</el-col>
              <el-col :span="16">{{scope.row.enterCarType}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">入口时间</el-col>
              <el-col :span="16">{{scope.row.enterTime | date}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">入口车牌</el-col>
              <el-col :span="16">{{scope.row.enterPlateId}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">出口收费站</el-col>
              <el-col :span="16">{{scope.row.exitStation}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">出口车道</el-col>
              <el-col :span="16">{{scope.row.exitLane}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">IC卡号</el-col>
              <el-col :span="16">{{scope.row.ICCard}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">出口时间</el-col>
              <el-col :span="16">{{scope.row.exitTime | date}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">收费员</el-col>
              <el-col :span="16">{{scope.row.operator}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">班次</el-col>
              <el-col :span="16">{{scope.row.workShift}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">车型</el-col>
              <el-col :span="16">{{scope.row.carType}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">车种</el-col>
              <el-col :span="16">{{scope.row.carKind}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">车情</el-col>
              <el-col :span="16">{{scope.row.payType}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">特情</el-col>
              <el-col :span="16">{{scope.row.situation}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">车牌号</el-col>
              <el-col :span="16">{{scope.row.plateColor}}{{scope.row.plateId}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">自动车牌</el-col>
              <el-col :span="16">{{scope.row.autoPlateId}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">总重</el-col>
              <el-col :span="16">{{scope.row.totalWeight}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">限重</el-col>
              <el-col :span="16">{{scope.row.limitWeight}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">超限率</el-col>
              <el-col :span="16">{{scope.row.overweightRate}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">金额</el-col>
              <el-col :span="16">{{scope.row.amount}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">优惠前金额</el-col>
              <el-col :span="16">{{scope.row.originalAmount}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">电子支付卡号</el-col>
              <el-col :span="16">{{scope.row.ETCId}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">二代卡号</el-col>
              <el-col :span="16">{{scope.row.ETC2Id}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">稽核信息</el-col>
              <el-col :span="16">{{scope.row.auditInformation}}</el-col>
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
      <el-table-column prop="enterStation" label="入口站"></el-table-column>
      <el-table-column label="入口时间" width="150">
        <template scope="scope">
          <span>{{ scope.row.enterTime | date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出口时间" width="150">
        <template scope="scope">
          <span>{{ scope.row.exitTime | date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template scope="scope">
          <span>{{scope.row.originalAmount}}</span>
          <el-tag type="gray" v-if="scope.row.amount > 0">{{scope.row.amount}}</el-tag>
          <el-tag type="success" v-else>已免费</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="收费员"></el-table-column>
      <el-table-column label="" width="80">
      </el-table-column>
      <el-table-column label="外站免费记录">
        <template scope="scope">
          <el-popover v-if="compareResult[scope.$index]" placement="right" title="详情" width="300" trigger="hover">
            <el-row>
              <el-col :span="8">班次</el-col>
              <el-col :span="16">{{compareResult[scope.$index].workShift}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">电子照片编号</el-col>
              <el-col :span="16">{{compareResult[scope.$index].pictureId}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">车牌照号</el-col>
              <el-col :span="16">{{compareResult[scope.$index].plateId}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">入口站</el-col>
              <el-col :span="16">{{compareResult[scope.$index].enterStation}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">出口站</el-col>
              <el-col :span="16">{{compareResult[scope.$index].exitStation}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">货物种类</el-col>
              <el-col :span="16">{{compareResult[scope.$index].category}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">操作时间</el-col>
              <el-col :span="16">{{compareResult[scope.$index].operationTime | date}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">免费金额</el-col>
              <el-col :span="16">{{compareResult[scope.$index].freeAmount}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">验货员</el-col>
              <el-col :span="16">{{compareResult[scope.$index].operator}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">监控员</el-col>
              <el-col :span="16">{{compareResult[scope.$index].supervisor}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">值班领导</el-col>
              <el-col :span="16">{{compareResult[scope.$index].leader}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">数据导入员</el-col>
              <el-col :span="16">{{compareResult[scope.$index].importer}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">数据导入时间</el-col>
              <el-col :span="16">{{compareResult[scope.$index].importTime | date}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">数据文件名</el-col>
              <el-col :span="16">{{compareResult[scope.$index].importFileName}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">数据表名</el-col>
              <el-col :span="16">{{compareResult[scope.$index].importSheetName}}</el-col>
            </el-row>
            <div slot="reference">
              <el-tag type="success">有免费记录</el-tag>
              <el-button type="text"><i class="el-icon-information"></i></el-button>
            </div>
          </el-popover>
          <el-tag type="danger" v-else>无记录</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Config from '../config'
  export default {
    data () {
      return {
        internalImportUrl: Config.api + '/internal/import',
        searchDate: '',
        searchPlate: '',
        list: [],
        compareResult: [],
        loading: false,
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
        this.$http.post(Config.api + '/internal/list', {
          date: this.searchDate,
          plate: this.searchPlate
        })
          .then(resp => {
            this.loading = false
            this.list = resp.data.list
            this.compareResult = resp.data.compareResult
          })
      },
      handleSearch () {
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
