const log = require('loggy');
const lights = require('../lib/lights');

let listening;

const getConfiguration = () => {
  return lights.getLights();
};

const listen = (state, poll) => {
  if (state !== !!listening) {
    listening = poll;
    state && update();
  }
};

let lightsState;
const update = (poll) => {
  lights.getLights.then(newLightsState => {
    // compare states
    !lightsState && (lightsState = newLightsState);

    const changes = [];

    for (let lightId in newLightsState) {
      const newLight = newLightsState[lightId];
      const oldLight = lightsState[lightId];

      const newState = newLight.state.on || newLight.action.on;
      const oldState = oldLight.state.on || oldLight.action.on;

      if (newState !== oldState) {
        changes.push(lightId);
      }
    }

    if (changes.length) {
      // broadcast changes
    }

    lightsState = newLightsState;

    setTimeout(update, listening);
  });
};

/**
 * Exports
 */
module.exports = function(config) {
  const listeners = {};

  listeners.connection = function(data) {
    log.info('Socket connected');

    getConfiguration().then(config => {
      data.socket.emit('configuration', config);

      let poll = config.lights.poll;
      if (!poll) {
        poll = 1000;
        log.warn('Lights poll number not provided [config.lights.poll]');
      }
      
      listen(true, poll);
    });
  };

  listeners.disconnect = function(data) {
    log.info('Socket disconnected');
  };

  listeners.switchLight = function(data) {
    log.info('Switching light');
  };

  return listeners;
};
