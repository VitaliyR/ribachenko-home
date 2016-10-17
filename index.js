const koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const log = require('loggy');
const config = require('./config');
const app = koa();

// TODO: move
const exec = require('child_process').exec;
const execute = function(command, callback) {
    exec(command, function(error, stdout, stderr) {
      error && log.error(stdout);
    });
};

router.get('/system/:action', function *(next) {
  const action = this.params.action;

  if (action === 'reboot') {
    execute('sudo reboot');
  } else if (action === 'shutdown') {
    execute('sudo poweroff');
  }

  this.status = 200;

  yield next;
});

app.use(router.routes());
app.use(serve('./public'));
app.use(function *() {
});

app.listen(config.server.port);
log.info('Listening at', config.server.port);
