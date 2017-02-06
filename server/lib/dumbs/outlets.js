const log = require('../log')('DumbOutlets');

class DumbOutletClient {
  constructor(opts) {
    log.info('Creating new dumb outlet');
    this.host = opts.host;

    const id = Math.floor(Math.random() * (10 - 1) + 1);
    this.name = `Camera ${id}`;

    this.state = false;
  }

  getInfo() {
    return Promise.resolve({
      sysInfo: {
        alias: this.name
      }
    });
  }

  getPowerState() {
    return Promise.resolve(this.state);
  }

  setPowerState(newState) {
    this.state = newState;
    return Promise.resolve();
  }
}

/**
 * Exports
 */
module.exports = function(opts, timeout) {
  return new DumbOutletClient(opts);
};
