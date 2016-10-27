const log = require('loggy');
const lights = require('../lib/lights');

const getConfiguration = () => {
  return lights.getLights();
};

module.exports = {
  connection: function(data) {
    log.info('Socket connected');
    getConfiguration().then(config => data.socket.emit('configuration', config));
  },

  switchLight: function(data) {
    log.info('Switching light');
  }
};
