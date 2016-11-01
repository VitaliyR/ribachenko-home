const log = require('loggy');
const lights = require('../lib/lights');

class LightsPoll {
  constructor(opts) {
    this.config = opts;
  }

  listen(state, cb) {
    this._delegate = cb;
    this._lightsState = null;
    this._state = state;
    !this._state && state && this._update();
  }

  _update(poll) {
    if (!this._state) return;

    lights.getLights.then(newLightsState => {
      !this._lightsState && (this._lightsState = newLightsState);

      const changes = [];

      for (let lightId in newLightsState) {
        const newLight = newLightsState[lightId];
        const oldLight = this._lightsState[lightId];

        const newState = newLight.state.on || newLight.action.on;
        const oldState = oldLight.state.on || oldLight.action.on;

        if (newState !== oldState) {
          changes.push(lightId);
        }
      }

      this._lightsState = newLightsState;

      if (changes.length) {
        this._delegate(changes);
      }

      setTimeout(this._update, this.config.poll);
    });
  }
}

/**
 * Exports
 */
module.exports = function(socket, config) {
  const listeners = {};
  const updater = new LightsPoll({
    poll: config.lights.poll
  });

  const broadcastChanges = (changes) => {
    log.info(changes);
  };

  listeners.connection = function(data) {
    log.info('Socket connected');

    lights.getLights().then(config => {
      data.socket.emit('configuration', config);

      updater.listen(true, broadcastChanges);
    }).catch(e => log.error(e));
  };

  listeners.disconnect = function(data) {
    log.info('Socket disconnected');
  };

  listeners.switchLight = function(e) {
    const data = Array.isArray(e.data) ? e.data : [e.data];
    const allLights = data.filter(el => el.id === '0');

    if (allLights.length) {
      lights.switchAllLights(allLights[0].state)
        .catch(e => log.error('Tried to switch all lights but can\'t, because', e.message))
        .then(() => {
          log.info('Switched all lights to', allLights[0].state);
          lights.getLights().then(config => e.socket.emit('configuration', config));
        });
    } else {
      lights.switchLights(data)
        .catch(e => log.error('Tried to switch lights but can\'t, because', e.message))
        .then(() => {
          log.info('Switched lights');
          lights.getLights().then(config => e.socket.emit('configuration', config));
        });
    }
  };

  return listeners;
};
