const app = require('koa')();
const serve = require('koa-static');
const log = require('loggy');

const config = require('../config');
const router = require('./router');

app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve('./public'));

app.listen(config.server.port, () => {
  log.info('Listening at', config.server.port);
});

module.exports = app;
