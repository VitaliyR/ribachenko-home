const request = require('request-promise-native');

let config;

module.exports = {
  configure: (newConfig) => {
    config = newConfig;
  },

  buildUrl: function(...methods) {
    return `${config.base}/api/${config.user}/` + methods.join('/');
  },

  getLights: function() {
    return Promise.all([
      request({ uri: this.buildUrl('groups', 0), json: true }),
      request({ uri: this.buildUrl('lights'), json: true })
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

    return request({
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
        return request({
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
