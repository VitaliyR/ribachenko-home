const koa = require('koa');
const serve = require('koa-static');
const log = require('loggy');
const config = require('./config');
const app = koa();

app.use(serve('./public'));
app.use(function *() {
  this.body = 'hello';
});

app.listen(config.server.port);
log.info('Listening at', config.server.port);
