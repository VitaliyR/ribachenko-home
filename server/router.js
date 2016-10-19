const router = require('koa-router')();

require('./controllers/system')(router);

module.exports = router;
