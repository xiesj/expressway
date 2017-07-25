<template>
  <div>
    <group-title>输入车牌数字后三位</group-title>
    <div class="plate-number">{{plateNumber}}</div>
    <grid :rows="3">
      <grid-item v-for="char in chars" :key="char" class="vux-tap-active" @click.native="handleChar(char)">
        <span class="grid-center" v-bind:style="gridItemStyle">{{char}}</span>
      </grid-item>
    </grid>
  </div>
</template>

<script>
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
        plateNumber: '',
        chars: [7, 8, 9, 4, 5, 6, 1, 2, 3, '0', '清空', '查询'],
        gridItemStyle: {
          height: document.body.clientWidth / 3 + 'px',
          lineHeight: document.body.clientWidth / 3 + 'px'
        }
      }
    },
    methods: {
      handleChar (char) {
        if (char === '查询') {
          this.submitForm()
        } else if (char === '清空') {
          this.plateNumber = ''
        } else {
          this.plateNumber += char
          if (this.plateNumber.length === 3) {
            this.submitForm()
          }
        }
      },
      submitForm () {
        if (this.plateNumber) {
          this.$router.push('/result/' + this.plateNumber)
        } else {
          this.$vux.toast.text('请输入车牌所有数字中的后三位')
        }
      }
    },
    mounted () {
    }
  }
</script>
<style scoped>
  .weui-grid, .weui-cell {
    padding: 0;
  }
  .grid-center {
    display: block;
    text-align: center;
    color: #666;
  }
  .plate-number{
    font-size: 28px;
    text-align: center;
    color: #666666;
    height: 50px;
    line-height: 50px;
  }
</style>
