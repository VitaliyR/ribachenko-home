const IO = require('koa-socket');
const app = require('koa')();
const serve = require('koa-static');
const io = new IO();
const log = require('./lib/log')('App');

const config = require('../config');

io.attach(app);

const router = require('./router')(app, config);
const appRouter = router.next().value;
const appSockets = router.next().value;

const loaders = [];

loaders.push(require('./lib/lights').configure(config.lights));
loaders.push(require('./lib/outlets').configure(config.outlets));
loaders.push(require('./lib/home').configure(config.home));

Promise.all(loaders).then(() => {
  log.info('Configured');

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
}).catch(err => {
  log.error('Can\'t configure');
  process.exit(1);
});

module.exports = app;
