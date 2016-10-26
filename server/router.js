const router = require('koa-router')();
const sockets = {};

require('./controllers/system')(router);
require('./controllers/lights')(router);

Object.assign(sockets, require('./controllers/socket'));

module.exports = function *() {
  yield router;
  return sockets;
};
