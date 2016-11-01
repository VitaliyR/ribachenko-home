const IO = require('koa-socket');
const app = require('koa')();
const serve = require('koa-static');
const io = new IO();
const log = require('loggy');

const config = require('../config');

io.attach(app);

const router = require('./router')(app, config);
const appRouter = router.next().value;
const appSockets = router.next().value;

require('./lib/lights').configure(config.lights);

app.use(appRouter.routes());
app.use(appRouter.allowedMethods());
app.use(serve('./public'));

for (let event in appSockets) {
  let handlers = appSockets[event];
  !Array.isArray(handlers) && (handlers = [handlers]);
  handlers.forEach(handler => io.on(event, handler));
}

app.listen(config.server.port, () => {
  log.info('Listening at', config.server.port);
});

module.exports = app;
