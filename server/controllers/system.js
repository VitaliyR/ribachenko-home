const log = require('loggy');
const execute = require('../lib/execute');

const actionHandler = function *(next) {
  const action = this.params.action;

  if (handlers[action]) {
    yield handlers[action];
    this.status = 200;
  } else {
    this.status = 404;
  }
  yield next;
};

const handlers = {
  shutdown: function *() {
    yield execute('sudo shutdown -h now');
  },

  reboot: function *() {
    yield execute('sudo reboot');
  },

  update: function *() {
    log.info('Starting update');

    yield execute('git pull')
      .then(() => {
        log.info('Repository changes pulled');
        return execute('npm i');
      })
      .then(() => {
        log.info('NPM packages installed');
        log.info('Frontend build');
        return execute('pm2 restart System');
      })
      .then(() => {
        log.info('Server restarted');
        log.info('System updated');
      });
  }
};

/**
 * Exports. Register routes for controller
 */
module.exports = function(router) {
  router.get('/system/:action', actionHandler);
};
