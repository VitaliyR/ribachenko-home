const log = require('loggy');
const lights = require('../lib/lights');

const getConfiguration = () => {
  return lights.getLights();
};

module.exports = {
  connection: function() {
    log.info('Socket connected');
    getConfiguration().then(config => {
      log.info(config);
    });
  }
};
