const md5Salt = require('../util/md5Salt')
module.exports = async (db) => {
  try {
    const Users = db.collection('admin');
    const userLen = await Users.find({}).toArray();
    if (userLen.length) { return }
    const { result } = await Users.insert({
      userName: 'admin',
      password: md5Salt.hashSalt(md5Salt.md5('123456')),
      createdAt: new Date()
    });

    if (!result || result.ok !== 1) {console.log('创建初始管理员：admin失败') ;return }
    console.log('创建初始管理员：admin成功,密码为123456')
  } catch (e) {
    console.log(e)
  }
}
