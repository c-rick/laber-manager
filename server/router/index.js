const Router = require('koa-router');
const indexRouter = Router();

indexRouter.get('/', (ctx) => {
  ctx.render('index.html');
})
module.exports = indexRouter
