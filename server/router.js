const router = require('koa-router')();

require('./controllers/system')(router);
require('./controllers/lights')(router);

module.exports = router;
