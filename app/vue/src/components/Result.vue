<template>
  <div>
    <x-header>查询结果</x-header>
    <template v-for="(row, index) in list">
      <cell
        :title="row.plateId"
        is-link
        :border-intent="false"
        :arrow-direction="activeCell == index ? 'up' : 'down'"
        @click.native="activeCell = activeCell == index ? -1 : index">
        <span class="operation-hour" v-bind:class="row.operationTime | diffHourColor">{{ row.operationTime | diffHour}}</span>
      </cell>
      <div class="slide" :class="activeCell == index ? 'animate' : ''">
        <group class="padding: 15px">
          <cell title="操作时间">{{row.operationTime | date}}</cell>
          <cell title="班次">{{row.workShift}}</cell>
          <cell title="电子照片编号">{{row.pictureId}}</cell>
          <cell title="车牌照号">{{row.plateId}}</cell>
          <cell title="入口站">{{row.enterStation}}</cell>
          <cell title="出口站">{{row.exitStation}}</cell>
          <cell title="货物种类代码">{{row.category}}</cell>
          <cell title="免费金额">{{row.freeAmount}}</cell>
          <cell title="验货人员">{{row.operator}}</cell>
          <cell title="监控员">{{row.supervisor}}</cell>
          <cell title="值班站领导">{{row.leader}}</cell>
          <cell title="数据导入员">{{row.importer}}</cell>
          <cell title="文件名">{{row.importFileName}}</cell>
          <cell title="表名">{{row.importSheetName}}</cell>
          <cell title="导入时间">{{row.importTime | date}}</cell>
        </group>
      </div>
    </template>
  </div>
</template>

<script>
  import Config from '../config'
  import { Toast, Grid, GridItem, GroupTitle, Group, Cell, CellBox, Divider, XButton, XInput, XHeader } from 'vux'

  export default {
    components: {
      Toast,
      Grid,
      GridItem,
      GroupTitle,
      Group,
      Divider,
      Cell,
      CellBox,
      XButton,
      XHeader,
      XInput
    },
    data () {
      return {
        list: [],
        activeCell: -1
      }
    },
    methods: {
      search (plate) {
        if (plate) {
          this.$vux.loading.show({
            text: '正在查询'
          })
          this.$http.post(Config.api + '/external/search', {
            plate: plate
          }).then((resp) => {
            this.$vux.loading.hide()
            this.plateNumber = ''
            if (resp && resp.data && resp.data.list && resp.data.list.length) {
              this.list = resp.data.list
            } else {
              this.$vux.toast.text('您输入的数字24小时内无相关记录')
              setTimeout(() => {
                this.$router.push('/search')
              }, 3000)
            }
          })
        } else {
          this.$vux.toast.text('请输入车牌所有数字中的后三位')
          setTimeout(() => {
            this.$router.push('/search')
          }, 3000)
        }
      }
    },
    mounted () {
      if (this.$route.params && this.$route.params.plate) {
        this.search(this.$route.params.plate)
      } else {
        this.$router.push('/search')
      }

      document.addEventListener('backbutton', () => {
        if (this.$route.path.indexOf('/result') === 0) {
          this.$router.push('/search')
        }
      }, false)
    }
  }
</script>
<style>
  .operation-hour {
    display: inline-block;
    text-align: center;
    padding: 2px 10px;
    border-radius: 5px;
    color: white;
    margin-right: 20px;
    font-size: 14px;
  }
  .success {
    background: #008000;
  }
  .warning {
    background: #ff9900;
  }
  .danger {
    background: #ff0000;
  }
  .operation-time{
    text-align: center;
  }
  .sub-item {
    color: #888;
  }
  .slide {
    padding-left: 15px;
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
  }
  .slide .weui-cells{
    margin-top: 0 !important;
  }
  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
</style>
