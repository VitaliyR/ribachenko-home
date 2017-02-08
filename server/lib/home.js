const log = require('./log')('Home');
const fs = require('fs-promise');
const mkdir = require('mkdirp-promise');
const path = require('path');

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
    return mkdir(path.dirname(config.db))
      .then(() => fs.writeFile(config.db, JSON.stringify(this.data)))
      .then(() => log.info('Store persisted'))
      .catch((e) => log.error(`Error while tried to persist the store: ${e.message}`));
  },

  getState: function() {
    return Promise.resolve(this.data);
  },

  switchState: function(atHome) {
    this.data.atHome = atHome;

    let runner = outlets.switchAllOutlets(!atHome);

    let turnOnLights;

    if (atHome) {
      const hours = (new Date()).getHours();
      const isDawn = hours >= 18 && hours <= 7;
      turnOnLights = isDawn;
    } else {
      turnOnLights = false;
    }

    runner.then(() => lights.switchAllLights(turnOnLights));

    this.persist();

    runner.then(() => {
      log.info(`${atHome ? 'At home' : 'Out of home'}. Outlets ${atHome ? 'turned off' : 'turned on'}. ${turnOnLights ? 'Lights turned off.' : ''}`);
      return Promise.resolve();
    });

    return runner;
  }
};
