const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const config = require('../config');

exports.jwtVerify = async (ctx, next) => {
  const Admin = ctx.db.collection('admin');

  const token = ctx.request.header.authorization;
  let id;
  if (!token) {
    return ctx.api({ code: 103 })
  }

  try {
    id = jwt.verify(token, config.jwtKey)['id']
  } catch (e) {
    return ctx.api({ code: 103 })
  }

  let user = await Admin.findOne({ _id: ObjectId(id) })
  if (!user) {
    return ctx.api({ code: 103 })
  }
  // TODO 权限校验
  ctx.user = user

  return next()
}
