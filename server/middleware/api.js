
const codes = require('../config/codes');

// handle response for api
module.exports = () => (ctx, next) => {
  ctx.api = (response = {}) => {
    ctx.status = 200;
    ctx.body = {};
    const code = response.code || 0
    ctx.body = {
      code: code,
      msg: response.msg || codes[code],
      data: response.data || {}
    }
  }
  return next();
}
