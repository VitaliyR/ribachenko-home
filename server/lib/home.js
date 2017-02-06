const log = require('./log')('Home');
const fs = require('fs-promise');

const outlets = require('./outlets');
const lights = require('./lights');

let config;

module.exports = {
  configure: function(newConfig) {
    config = newConfig;

    return this.load();
  },

  load: function() {
    return fs.readFile(config.db)
      .then(data => (this.data = JSON.parse(data)))
      .catch(e => {
        log.info('Creating new store');
        this.data = {
          atHome: true
        };
      });
  },

  persist: function() {
    return fs.writeFile(config.db, JSON.stringify(this.data))
      .then(() => log.info('Store persisted'))
      .catch((e) => log.error(`Error while tried to persist the store: ${e.message}`));
  },

  getState: function() {
    return Promise.resolve(this.data);
  },

  switchState: function(state) {
    this.data.atHome = state;

    let runner = outlets.switchAllOutlets(!state);

    let turnOffLights;

    if (state) {
      const hours = (new Date()).getHours();
      const isDawn = hours >= 18 && hours <= 7;
      turnOffLights = !isDawn;
    } else {
      turnOffLights = true;
    }

    if (turnOffLights) {
      runner.then(() => lights.switchAllLights(false));
    }

    this.persist();

    runner.then(() => {
      log.info(`${state ? 'At home' : 'Out of home'}. Outlets ${state ? 'turned off' : 'turned on'}. ${turnOffLights ? 'Lights turned off.' : ''}`);
      return Promise.resolve();
    });

    return runner;
  }
};
