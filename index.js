const path = require('path')

const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const MongoClient = require('mongodb').MongoClient;

// middleware
const render = require('./server/middleware/render');
const api = require('./server/middleware/api');
const reqInfo = require('./server/middleware/reqInfo');
// router
const router = require('koa-router')();
const indexRouter = require('./server/router');
const apiRouter = require('./server/router/api');
// config
const config = require('./server/config')

const init = require('./server/script/init.js')


app.use(bodyParser());
app.use(serve(path.join(__dirname, './files')))
app.use(serve(path.join(__dirname, 'dist')));
app.use(render(path.join(__dirname, '')));
app.use(api());
app.use(reqInfo());

router.use('/', indexRouter.routes(), indexRouter.allowedMethods());
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
app.use(router.routes(), router.allowedMethods());
app.use((ctx) => {
  ctx.render('index.html');
})


MongoClient.connect(config.connectUrl, (err, instance) => {
  if (err) { throw err}
  app.context.db = instance;
  init(instance);
  app.listen(3000, () => console.log('Server is running ...'))
})
