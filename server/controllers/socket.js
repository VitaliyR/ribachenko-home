const log = require('loggy');
const lights = require('../lib/lights');

const getConfiguration = () => {
  return lights.getLights();
};

module.exports = function(config) {
  const listeners = {};
  let listenChanges;

  listeners.connection = function(data) {
    log.info('Socket connected');
    return data.socket.emit('configuration', {
      0: {
        name: 'All Lights',
        state: false
      },
      1: {
        name: 'Test 1',
        state: false
      },
      5: {
        name: 'test 2',
        state: true
      }
    });
    // getConfiguration().then(config => data.socket.emit('configuration', config));
    if (!listenChanges) {
      listenChanges = true;
    }
  };

  listeners.disconnect = function(data) {
    log.info('Socket disconnected');
  };

  listeners.switchLight = function(data) {
    log.info('Switching light');
  };

  return listeners;
};
