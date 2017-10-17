const Router = require('koa-router');
const apiRouter = Router();
const admin = require('../controller/admin')
const label = require('../controller/label')
const jwt = require('../middleware/jwt')

apiRouter.post('/signin', admin.signin);

// apiRouter.get('/servers', jwt.jwtVerify, server.get);
apiRouter.post('/label', jwt.jwtVerify, label.getLabels);
apiRouter.put('/label', jwt.jwtVerify, label.updateLabel);
apiRouter.post('/downloadlabel', jwt.jwtVerify, label.downloadLabel);
// apiRouter.put('/server', jwt.jwtVerify, server.editServer);
// apiRouter.put('/setting',jwt.jwtVerify, server.editSetting)
// apiRouter.delete('/server/:id', jwt.jwtVerify, server.delete);

module.exports = apiRouter;
