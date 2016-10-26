const request = require('request-promise-native');

var config;

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
      for (let lampId in config[1]) {
        config[1][lampId].name = lampId === 0 ? 'All Lights' : `Light ${lampId}`;
      }
      return config[1];
    });
  },

  switchLights: function(state) {
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
