const router = require('koa-router')();
const sockets = require('./controllers/socket');

require('./controllers/system')(router);

module.exports = function *(app, config) {
  yield router;
  return sockets(app.io, config);
};
