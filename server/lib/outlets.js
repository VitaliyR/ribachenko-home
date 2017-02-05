const Hs100Api = require('hs100-api');
const log = require('./log')('Outlets');

let config, client, plugs, outlets;

module.exports = {
  configure: (newConfig) => {
    config = newConfig;

    if (!config.poll) {
      config.poll = 1000;
      log.warn('Outlets poll number not provided [config.outlets.poll]');
    }

    config.dumb && log.info('Configured to use dumb data');
    config.dumb && config.dumbTimeout && log.info('Using timeout for responses', config.dumbTimeout);

    client = new Hs100Api.Client();
    plugs = {};
    outlets = {};
    config.outlets.forEach(ip => {
      const plug = client.getPlug({ host: ip });
      plugs[ip] = plug;
      outlets[ip] = {
        ip: ip
      };
      plug.getInfo().then(info => outlets[ip].info = info);
    });

    return Promise.resolve();
  },

  getOutlets: function() {
    return Promise.all(
      Object.keys(outlets).map(outletId => {
        const plug = plugs[outletId];
        const outlet = outlets[outletId];

        return plug.getPowerState()
          .then(state => {
            outlet.state = state;
            return outlet;
          });
      })
    );
  },

  switchAllOutlets: function(state) {
    state = !!state;

    this._skipOnceUpdate = true;

    return this.switchOutlets(
      Object.keys(outlets).map(outletId => {
        return { id: outletId, state: state }
      })
    );
  },

  switchOutlets: function(outlets) {
    this._skipOnceUpdate = true;
    return Promise.all(
      outlets.map(outlet => {
        let plug = plugs[outlet.id];
        return plug.setPowerState(outlet.state);
      })
    );
  },

  monitor: function(state, cb) {
    if (this._updating === state) return;

    log.info(state ? 'Start to monitor for changes' : 'Stop to monitor changes');
    this._updateCb = cb;
    this._updating = state;
    this._update();
  },

  _update() {
    if (!this._updating) return;
    if (this._skipOnceUpdate) {
      this._skipOnceUpdate = false;
      return setTimeout(this._update.bind(this), config.poll);
    }

    if (!this._outletsState) {
      this._outletsState = {};
      Object.keys(outlets).forEach(outletId => this._outletsState[outletId] = outlets[outletId].state);
    }

    this.getOutlets().then(newOutletsState => {
      let changes = false;

      Object.keys(newOutletsState).forEach(outletId => {
        const outlet = newOutletsState[outletId];
        const state = outlet.state;
        const oldState = this._outletsState[outletId];

        if (state !== oldState) {
          changes = true;
        }

        this._outletsState[outletId] = state;
      });

      if (changes) {
        log.info('Found changes in outletsState');
        this._updateCb(changes, newOutletsState);
      }

      setTimeout(this._update.bind(this), config.poll);
    }).catch(e => log.error(e));
  }
};
