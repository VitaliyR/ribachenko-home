const router = require('koa-router')();

require('./controllers/system')(router);
require('./controllers/config')(router);

module.exports = router;
