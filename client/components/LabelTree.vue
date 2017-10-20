<template>
  <div class="childLabel">
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
  border: none;
  padding: 10px;
  text-align: center;
  background: #d5c59f;
  font-size: 14px;
  color: #fff;
  flex-grow:1;
}
.childLabel{
  flex-grow:1;
  display:flex;
}
.childSpan{
  display: inline-block;
  width: 150px;
  text-align: center;
  background: #999d9c;
  color: #eee;
}
.childItem{
  display: inline-block;
  flex-grow: 1;
  vertical-align: top;
}
.childItem .childItem{
  flex-grow: 1;
}
.childItem .childSpan{
  background: #afb4db;
}
.childItem .childItem .childSpan {
  background: #7bbfea;
}
.childItem .el-form-item{
  position: relative;
}
.childItem .el-form-item:not(:last-child):after{
  content: "";
  height: 2px;
  width: 100%;
  background: #fff;
  position: absolute;
  bottom: -1px;
  left: 0;
} 
</style>
