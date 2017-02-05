const request = require('request-promise-native');
const log = require('./log')('Lights');
const dumb = require('./dumb');

let config;

module.exports = {
  configure: (newConfig) => {
    config = newConfig;

    if (!config.poll) {
      config.poll = 1000;
      log.warn('Lights poll number not provided [config.lights.poll]');
    }

    config.dumb && log.info('Configured to use dumb data');
    config.dumb && config.dumbTimeout && log.info('Using timeout for responses', config.dumbTimeout);

    return Promise.resolve();
  },

  buildUrl: function(...methods) {
    return `${config.base}/api/${config.user}/` + methods.join('/');
  },

  request: function(opts) {
    return config.dumb ? dumb(opts, config.dumbTimeout) : request(opts);
  },

  getLights: function() {
    return Promise.all([
      this.request({ uri: this.buildUrl('groups', 0), json: true }),
      this.request({ uri: this.buildUrl('lights'), json: true })
    ]).then(config => {
      config[1][0] = config[0];
      config = config[1];

      for (let lightId in config) {
        const light = config[lightId];
        const key = lightId === '0' ? 'action' : 'state';

        config[lightId] = {
          name: lightId === '0' ? 'All Lights' : `Light ${lightId}`,
          state: light[key].on,
          bri: light[key].bri,
          sat: light[key].sat,
          hue: light[key].hue
        };
      }

      return config;
    });
  },

  switchAllLights: function(state) {
    state = !!state;

      this._skipOnceUpdate = true;

    return this.request({
      uri: this.buildUrl('groups', 0, 'action'),
      method: 'PUT',
      json: {
        on: state
      }
    });
  },

  switchLights: function(lights) {
    this._skipOnceUpdate = true;

    return Promise.all(
      lights.map(light => {
        return this.request({
          uri: this.buildUrl('lights', light.id, 'state'),
          method: 'PUT',
          json: {
            on: light.state
          }
        });
      })
    );
  },

  monitor: function(state, cb) {
    if (this._updating === state) return;

    log.info(state ? 'Start to monitor for changes' : 'Stop to monitor changes');
    this._updateCb = cb;
    this._updating = state;
    this._update();
  },

  _update() {
    if (!this._updating) return;
    if (this._skipOnceUpdate) {
      this._skipOnceUpdate = false;
      return setTimeout(this._update.bind(this), config.poll);
    }

    this.getLights().then(newLightsState => {
      !this._lightsState && (this._lightsState = newLightsState);

      const changes = [];

      for (let lightId in newLightsState) {
        const newLight = newLightsState[lightId];
        const oldLight = this._lightsState[lightId];

        const newState = newLight.state;
        const oldState = oldLight.state;

        if (newState !== oldState) {
          changes.push(lightId);
        }
      }

      this._lightsState = newLightsState;

      if (changes.length) {
        log.info('Found changes in lightsState');
        this._updateCb(changes, this._lightsState);
      }

      setTimeout(this._update.bind(this), config.poll);
    }).catch(e => log.error(e));
  }
};
