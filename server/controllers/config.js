const lights = require('../lib/lights');

const getConfiguration = function *(next) {
  const config = {
    lights: lights.getLights()
  };

  this.body = config;
  yield next;
};

/**
 * Exports. Register routes for controller
 */
module.exports = function(router) {
  router.get('/configuration', getConfiguration);
};
