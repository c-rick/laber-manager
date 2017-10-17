
const fs = require('fs');
const path = require('path');

// render html views
module.exports = function (dir) {
  return (ctx, next) => {
    ctx.render = (template) => {
      ctx.type = 'text/html; charset=utf-8';
      ctx.body = fs.readFileSync(path.join(dir, template));
    }
    return next();
  }
}
