const request = require('request-promise-native');
const log = require('loggy');
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

      for (let lampId in config) {
        let lamp = config[lampId];
        let key = lampId === '0' ? 'action' : 'state';

        config[lampId] = {
          name: lampId === '0' ? 'All Lights' : `Light ${lampId}`,
          state: lamp[key].on,
          bri: lamp[key].bri,
          sat: lamp[key].sat,
          hue: lamp[key].hue
        };
      }

      return config;
    });
  },

  switchAllLights: function(state) {
    state = !!state;

    return this.request({
      uri: this.buildUrl('groups', 0, 'action'),
      method: 'PUT',
      json: {
        on: state
      }
    });
  },

  switchLights: function(lights) {
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
  }
};
