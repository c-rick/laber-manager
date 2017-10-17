<template>
  <div >
    <span class="childSpan">{{label}}</span>
    <div class="childItem" v-if="isObject">
      <el-form-item v-for="childitem in Object.keys(newModel)" :key="childitem" >
        <label-tree :changeKey="changeKey" :model="newModel[childitem]" :label="childitem" :childKey="childitem" />
      </el-form-item>
    </div>
    <input class="label-input" v-if="!isObject" v-model="newModel" />
  </div>
</template>
 
<script>
export default {
  name: 'labelTree',
  props: ['model', 'childKey', 'changeKey', 'label'],
  data () {
    return {
    }
  },
  computed: {
    isObject () {
      return this.model instanceof Object && !Array.isArray(this.model)
    },
    newModel: {
      get () {
        return this.model
      },
      set (val) {
        this.changeKey({ [this.childKey]: val })
      }
    }
  }
}
</script>
<style scoped>
.label-input{
  display: inline-block;
  border: none;
  padding: 10px;
  width: 100px;
  text-align: center;
  background: #d5c59f;
  font-size: 14px;
  vertical-align: top;
  color: #fff;
}
.childSpan{
  vertical-align: top;
  display: inline-block;
  width: 120px;
  text-align: center;
  background: #999d9c;
  color: #eee;
}
.childItem{
  display: inline-block;
  width: 75%;
  vertical-align: top;
}
.childItem .childItem{
  width: 60%;
}
.childItem .el-form-item{
  margin-bottom: 3px;
} 
</style>
