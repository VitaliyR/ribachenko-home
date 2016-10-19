const execute = require('../lib/execute');

const actionHandler = function *(next) {
  const action = this.params.action;

  if (action === 'reboot') {
    execute('sudo reboot');
  } else if (action === 'shutdown') {
    execute('sudo poweroff');
  }

  this.status = 200;

  yield next;
};

/**
 * Exports. Register routes for controller
 */
module.exports = function(router) {
  router.get('/system/:action', actionHandler);
};
