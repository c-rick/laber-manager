<template>
  <div class="LabelDetial">
      <el-form :model="detailData" ref="detailForm" >
        <el-form-item v-for="item in Object.keys(detailData)" :key="item">
          <label-tree v-if="item !== '_id'" class="label-tree" :changeKey="changeKey" :label="item"  :model="detailData[item]" :childKey="item"  />
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import LabelTree from './LabelTree.vue'

export default {
  props: ['detailData'],
  data () {
    return {
    }
  },
  methods: {
    updateLabel (done, instance) {
      this.$refs.detailForm.validate((valid) => {
        if (!valid) { return false }
        let loading = this.$loading({ text: '正在更新 ...' })
        this.$http.put('/api/label', this.detailData).then((res) => {
          loading.close()
          const { code, msg } = res.data
          if (code === 103) {
            return false
          }
          done()
          instance.confirmButtonLoading = false;
          instance.confirmButtonText = '修改数据';
          this.$notify.success({ title: '提示', message: msg, duration: 2000 })
        }, (res) => loading.close())
      })
    },
    changeKey (obj) {
      const key = Object.keys(obj)[0]
      const a = this.extend(this.detailData, obj, key)
    },
    extend (obj1, obj2, key) {
      var k;
      if (obj1.hasOwnProperty(key)) {
        return Object.assign(obj1, obj2)
      }
      for (k in obj1) {
        if (typeof obj1[k] === 'object' && !(obj1[k] instanceof Array)) {
          this.extend(obj1[k], obj2, key)
        }
      }
    }
  },
  components: {
    LabelTree
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.LabelDetial form {
  background: #fff;
  position: relative;
  margin: 0 auto;
  max-height: 350px;
  overflow: scroll;
}
.label-tree{
  display: flex;
  justify-content: space-between;
}
</style>
