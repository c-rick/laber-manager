const jwt = require('jsonwebtoken');
const config = require('../config');
const md5Salt = require('../util/md5Salt')


exports.signin = async (ctx) => {
  try {
    const { userName, password } = ctx.request.body;
    const Users = ctx.db.collection('admin');

    let user = await Users.findOne({ userName });
    if (!user) { return ctx.api({ code: 101 }) }
    if (!md5Salt.inspectSalt(password, user.password)) { return ctx.api({ code: 102}) }

    const token = jwt.sign({
      id: user._id
    }, config.jwtKey, config.jwtTimeOut);

    console.log(`用户${user.userName}已登陆，token值为${token}`)

    ctx.api({ data: { token, user } })
  } catch (e) {
    ctx.api({ code: 500 })
    console.log(e)
  }
}

