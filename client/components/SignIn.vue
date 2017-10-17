<template>
  <div class="sign">
    <el-form :show-message="false" :model="signForm" :rules="rules" label-width="0" ref="signForm">
      <h1>Label Login</h1>
      <el-form-item  required prop="userName">
        <el-input v-model="signForm.userName" placeholder="UserName"></el-input>
      </el-form-item>
      <el-form-item required prop="password">
        <el-input type="password" v-model="signForm.password" auto-complete="off" placeholder="PassWord"></el-input>
      </el-form-item>
      <div class="sign-btn">
        <el-button type="primary" @click="handleSubmit">登录</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import router from '../router'
import Session from '../util/session'
import MD5 from 'js-md5'

const session = new Session()

export default {
  data () {
    return {
      signForm: { userName: '', password: '' },
      rules: {
        userName: [
          { validator: (rule, value, callback) => {
            value === '' ? this.showValidateError('请输入用户名', callback) : callback()
          }, tigger: 'blur' }
        ],
        password: [
          { validator: (rule, value, callback) => {
            value === '' ? this.showValidateError('请输入密码', callback) : callback()
          }, tigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleReset () {
      this.$refs.signForm.resetFields()
    },
    handleSubmit () {
      this.$refs.signForm.validate((valid) => {
        if (!valid) { return false }
        let newForm = Object.assign({}, this.signForm, { password: MD5(this.signForm.password)});
        let loading = this.$loading({ text: '正在登录 ...' })
        this.$http.post('/api/signin', newForm).then((res) => {
          loading.close()
          const { code, data, msg } = res.data
          if (code !== 0) {
            this.$notify({
              title: '提示',
              message: msg,
              duration: 1000
            })
          } else {
            session.set('user', data.user)
            session.set('token', data.token)
            router.push('/')
          }
        }, () => loading.close())
      })
    },
    showValidateError (text, callback) {
      this.$message({
        showClose: true,
        message: text,
        type: 'error',
        duration: 1000
      });
      callback(new Error(text))
    }
  }
}
</script>

<style>
.sign {
  width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 30px 20px 20px 20px;
  background: #fff;
  border-radius: 10px;
  transform: translate(-50%,-50%);
}
.sign h1{
  color:#999;
  margin-bottom: 22px;
  text-align: center;
}
.sign .sign-btn{
  text-align: center;
}
.sign .el-input__inner{
  font-size:13px;
}
</style>
