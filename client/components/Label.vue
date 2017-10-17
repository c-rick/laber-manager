<template>
  <div class="Label">
    <el-form :inline="true" v-model="labelForm" ref="labelForm" :show-message="false" >
      <el-form-item label="" >
        <input-tag :tags="labelForm.keys" :placeholder="'Key'" :max="3" />
      </el-form-item>
      <code>:</code>
      <el-form-item label="" >
        <input-tag :tags="labelForm.values" :placeholder="'Value'" :max="3" />
      </el-form-item>
      <el-button type="primary" class="search-btn" @click="getLabel">查询</el-button>
      <el-dropdown @command="handleCommand" class="csv-btn">
        <span class="el-dropdown-link">
          More<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="downCsv">导出csv</el-dropdown-item>
          <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form>
    <div class="labelResult">
      <h2 v-if="temps.length === 0 ">----  无记录  ----</h2>
      <ul v-if="temps.length>0 ">
        <el-table :data="temps" style="width: 100%">
          <el-table-column prop="filename" label="Filename">
          </el-table-column>
          <el-table-column prop="file_dir" label="File_Dir">
          </el-table-column>
          <el-table-column prop="original_filename" label="Original_Filename" width="160">
          </el-table-column>
          <el-table-column prop="source" label="Source">
          </el-table-column>
          <el-table-column class-name="label-row" label="Label" width="160" >
            <template slot-scope="scope">
              <div v-if="scope.row.label">
                <li :key="key" v-for="(key, index) in Object.keys(scope.row.label)">{{key+' : '+scope.row.label[key]}}</li>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="getDetail(scope.row)" size="small">详情</el-button>
            </template>
          </el-table-column> 
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="currentSize"
          layout="total, prev, pager, next"
          :total="totalNum">
        </el-pagination>
      </ul>
    </div>
  </div>
</template>

<script>
import LabelDetial from './LabelDetial.vue'
import InputTag from './InputTag.vue'
import router from '../router'

export default {
  data () {
    return {
      labelForm: {
        keys: [],
        values: []
      },
      temps: [],
      totalNum: 0,
      currentPage: 1,
      currentSize: 10
    }
  },
  methods: {
    getLabel () {
      const { labelForm, currentPage, currentSize } = this
      const result = this.checkLabelForm()
      if (result !== 'ok') { return }
      let loading = this.$loading({ text: '正在查询 ...' })
      const newFormDate = Object.assign({}, labelForm, { currentPage, currentSize })
      this.$http.post('/api/label', newFormDate).then((res) => {
        loading.close()
        const { code, data, msg } = res.data
        if (code === 103) {
          return false
        }
        this.$notify.success({ title: '提示', message: msg, duration: 2000 })
        this.temps = data.pageDate
        this.totalNum = data.total
      }, (res) => loading.close())
    },
    downCsv () {
      const result = this.checkLabelForm()
      if (result !== 'ok') { return }
      let loading = this.$loading({ text: '正在下载 ...' })
      this.$http.post('/api/downloadlabel', this.labelForm).then((res) => {
        loading.close()
        const { code, data, msg } = res.data
        if (code === 103) {
          return false
        }
        if (code === 206) {
          let a = document.createElement('a');
          a.download = `${new Date().getTime()}.csv`;
          a.href = data;
          a.click();
        }
        this.$notify.success({ title: '提示', message: msg, duration: 2000 })
      }, (res) => loading.close())
    },
    checkLabelForm () {
      const klen = this.labelForm.keys.length;
      const vlen = this.labelForm.values.length
      if (klen === 0) {
        return this.showValidateError('请输入至少一个Key')
      } else if (vlen === 0) {
        return this.showValidateError('请输入至少一个Value')
      } else if (klen !== vlen) {
        return this.showValidateError('请输入对应数量的key:value')
      }
      return 'ok'
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getLabel()
    },
    getDetail (temp) {
      const h = this.$createElement;
      this.$msgbox({
        title: '详情',
        message: h(LabelDetial, { props: { detailData: temp }, ref: 'detailForm' }),
        showCancelButton: true,
        confirmButtonText: '修改数据',
        cancelButtonText: '关闭',
        showConfirmButton: false,
        beforeClose: (action, i, done) => {
          if (action === 'confirm') {
            i.confirmButtonLoading = true;
            i.confirmButtonText = '更新中...';
            this.$refs.detailForm.updateLabel(done, i)
          } else {
            done();
          }
        }
      })
    },
    showValidateError (text) {
      this.$message({
        showClose: true,
        message: text,
        duration: 1000
      })
    },
    handleCommand (handler) {
      this[handler]()
    },
    loginOut () {
      sessionStorage.clear();
      router.replace('/signin');
    }
  },
  components: {
    LabelDetial,
    InputTag
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.Label {
  padding: 40px;
}
.Label form,.labelResult .el-pagination,.labelResult h2 {
  text-align: center
}
.labelResult h2 {
  color:#999;
  margin: 60px 0;
}
.labelResult>ul {
  padding: 20px;
  border-radius: 10px;
  background: #fff;
}
.labelResult>ul li {
  list-style: none;
}
.labelResult .el-pagination {
  margin-top: 20px;
}
.Label form code {
  line-height: 36px;
}
.Label form .el-form-item {
  margin-right: 0;
}
.search-btn{
  width: 150px;
  margin-left: 16px;
}
.csv-btn{
  float: right;
  width: 90px;
  line-height: 40px;
}
.labelResult td.label-row .cell {
  padding: 0;
}
.labelResult td{
  padding: 0;
}
.labelResult td:last-child .cell{
  text-align: center;
}
.labelResult td.label-row div.cell div>li{
  padding: 5px 10px;
}
.labelResult td.label-row div.cell div>li:nth-child(even) {
  background: #e6e8eb;
}
.el-message-box{
  width: 600px
}
</style>
