const log = require('loggy');
const lights = require('../lib/lights');

const switchLights = function *(next) {
  let { lightId, lightState } = this.params;
  lightState = !!lightState;
  lightId = parseInt(lightId, 10) || 0;

  if (lightId === 0) {
    log.info('Switching all lights to', lightState);
    yield lights.switchLights(lightState);
  }

  this.status = 200;
  yield next;
};

/**
 * Exports. Register routes for controller
 */
module.exports = function(router) {
  router.get('/lights/:lightId/:lightState', switchLights);
};
