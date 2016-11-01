const log = require('loggy');
const lights = require('../lib/lights');

/**
 * Exports
 */
module.exports = function(socket, config) {
  const flags = {};
  const listeners = {};

  const broadcastChanges = (changes, lights) => {
    log.info('Broadcasting changes in lightsState to sockets');
    socket.broadcast('lights:update', lights);
  };

  listeners.connection = function(data) {
    log.info('Socket connected');

    lights.getLights().then(config => {
      data.socket.emit('configuration', config);

      lights.monitor(true, broadcastChanges);
    }).catch(e => log.error(e));
  };

  listeners.disconnect = function(data) {
    log.info('Socket disconnected');
  };

  listeners.switchLight = function(e) {
    if (flags.switchingLight) return;

    const data = Array.isArray(e.data) ? e.data : [e.data];
    const allLights = data.filter(el => el.id === '0');
    let runner;

    flags.switchingLight = true;

    if (allLights.length) {
      runner = lights.switchAllLights(allLights[0].state)
        .catch(e => log.error('Tried to switch all lights but can\'t, because', e.message))
        .then(() => log.info('Switched all lights to', allLights[0].state));
    } else {
      runner = lights.switchLights(data)
        .catch(e => log.error('Tried to switch lights but can\'t, because', e.message))
        .then(() => log.info('Switched lights'));
    }

    runner.then(config => {
      lights.getLights().then(config => {
        e.socket.emit('configuration', config);
        flags.switchingLight = false;
      });
    });
  };

  return listeners;
};
