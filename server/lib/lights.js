const request = require('request-promise');

var config;

module.exports = {
  configure: (newConfig) => {
    config = newConfig;
  },

  buildUrl: (...methods) => {
    return `${config.base}/${config.user}/` + methods.join('/');
  },

  getLights: () => {
    return request(this.buildUrl('lights'));
  },

  switchLights: (state) => {
    state = !!state;

    return request({
      uri: this.buildUrl('groups', 0, 'action'),
      method: 'PUT',
      json: {
        on: state
      }
    });
  }
};
