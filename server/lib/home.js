const log = require('./log')('Home');
const fs = require('fs-promise');

const outlets = require('./outlets');

let config;

module.exports = {
  configure: function(newConfig) {
    config = newConfig;

    return this.load();
  },

  load: function() {
    return fs.readFile(config.db)
      .then(data => this.data = JSON.parse(data))
      .catch(e => {
        log.info('Creating new store');
        this.data = {
          atHome: true
        };
      });
  },

  persist: function() {
    return fs.writeFile(config.db, JSON.stringify(this.data));
  },

  getState: function() {
    return Promise.resolve(this.data);
  },

  switchState: function(state) {
    this.data.atHome = state;

    outlets.switchAllOutlets(!state);

    return Promise.resolve();
  }
};
