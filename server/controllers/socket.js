const log = require('../lib/log')('Socket');
const lights = require('../lib/lights');
const outlets = require('../lib/outlets');
const home = require('../lib/home');

/**
 * Exports
 */
module.exports = function(socket, config) {
  const flags = {};
  const listeners = {};

  const broadcastFactory = (name) => {
    return (changes, data) => {
      log.info(`Broadcasting changes in ${name} to sockets`);
      socket.broadcast(`${name}:update`, data);
    };
  };

  const getConfig = (socket) => {
    return Promise.all([
      lights.getLights(),
      outlets.getOutlets(),
      home.getState()
    ]).then(configs => {
      socket.emit('configuration', {
        lights: configs[0],
        outlets: configs[1],
        home: configs[2]
      });
      return configs;
    }).catch(e => log.error(e));
  };

  listeners.connection = function(data) {
    log.info('Socket connected');

    getConfig(data.socket)
      .then(() => {
        lights.monitor(true, broadcastFactory('lights'));
        outlets.monitor(true, broadcastFactory('outlets'))
      });
  };

  listeners.disconnect = function() {
    log.info('Socket disconnected');
  };

  listeners.switchLight = function(e) {
    if (flags.switchingLight) return;

    const data = Array.isArray(e.data) ? e.data : [e.data];
    const allLights = data.filter(el => el.id == 0);
    let runner;

    flags.switchingLight = true;

    if (allLights.length) {
      runner = lights.switchAllLights(allLights[0].state)
        .catch(e => log.error('Tried to switch all lights but can\'t, because', e.message))
        .then(() => log.info('Switched all lights to', allLights[0].state));
    } else {
      runner = lights.switchLights(data)
        .catch(e => log.error('Tried to switch lights but can\'t, because', e.message))
        .then(() => log.info('Switched lights'));
    }

    runner.then(config => {
      lights.getLights().then(config => {
        e.socket.emit('configuration', { lights: config });
        flags.switchingLight = false;
      });
    });
  };

  listeners.switchOutlet = function(e) {
    if (flags.switchingOutlet) return;

    const data = Array.isArray(e.data) ? e.data : [e.data];

    flags.switchingOutlet = true;

    outlets.switchOutlets(data)
      .catch(e => log.error('Tried to switch all lights but can\'t, because', e.message))
      .then(() => log.info('Switched outlets'))
      .then(outlets.getOutlets)
      .then((config) => {
        e.socket.emit('configuration', { outlets: config });
        flags.switchingOutlet = false;
      });
  };

  listeners.switchHome = function(e) {
    if (flags.switchingHome) return;

    const state = e.data.state;

    flags.switchingHome = true;

    home.switchState(state)
      .catch(e => log.error('Tried to switch home state but can\'t, because', e.message))
      .then(() => log.info('Switched outlets'))
      .then(() => getConfig(e.socket))
      .then(() => {
        flags.switchingHome = false;
      });
  };

  return listeners;
};
