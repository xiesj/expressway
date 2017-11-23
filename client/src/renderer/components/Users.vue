<template>
  <div>
    <div class="action-bar">
      <el-row>
        <el-col :span="6">
          <el-button @click="handleAdd" type="info" class="pull-left" icon="plus">添加新账号</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table class="data-table" :data="users" :height="584" border>
      <el-table-column prop="id" label="工号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="team" label="班组"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button-group>
            <el-button type="info" @click="handleEdit(scope.$index, scope.row)" size="small" icon="edit"></el-button>
            <el-button type="info" @click="handleDelete(scope.$index, scope.row)" size="small" icon="delete"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加账号" :visible.sync="editFormDialogVisible">
      <el-form :model="editForm">
        <el-form-item label="工号" :label-width="editFormLabelWidth">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="editFormLabelWidth">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班组" :label-width="editFormLabelWidth">
          <el-input v-model="editForm.team" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="editFormLabelWidth">
          <el-input v-model="editForm.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Config from '../config'
  export default {
    data () {
      return {
        users: [],
        editFormDialogVisible: false,
        editFormLabelWidth: '50px',
        editForm: {
          _id: '',
          id: '',
          name: '',
          team: '',
          age: '',
          phone: '',
          password: ''
        }
      }
    },
    methods: {
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
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(() => {
              this.$message.error('删除失败!')
            })
        }).catch(() => {
        })
      },
      handleAdd () {
        Object.assign(this.$data.editForm, this.$options.data().editForm)
        this.editFormDialogVisible = true
      },
      handleSubmit () {
        if (!this.editForm._id) {
          console.log('add user', this.editForm)
          this.$http.post(Config.api + '/users/add', this.editForm)
            .then(resp => {
              if (resp.data.error) {
                if (resp.data.error.code === 11000) {
                  this.$message.error('添加失败, 已存在相同数据!')
                } else {
                  this.$message.error(resp.data.error)
                }
              } else {
                this.loadUsers()
                this.editFormDialogVisible = false
              }
            })
        } else {
          console.log('edit user', this.editForm)
          this.$http.put(Config.api + '/users/update', this.editForm)
            .then(resp => {
              if (resp.data.error) {
                if (resp.data.error.code === 11000) {
                  this.$message.error('编辑失败, 已存在相同数据!')
                } else {
                  this.$message.error(resp.data.error)
                }
              } else {
                this.loadUsers()
                this.editFormDialogVisible = false
              }
            })
        }
      },
      loadUsers () {
        this.$http.get(Config.api + '/users/list')
          .then(resp => {
            this.users = resp.data.users
          })
      }
    },
    mounted () {
      this.loadUsers()
    }
  }
</script>

<style>
</style>
