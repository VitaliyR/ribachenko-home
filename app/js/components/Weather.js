var Base = require('../core/Base');
var utils = require('../lib/utils');

module.exports = Base.extend({
  template: require('templates/components/weather'),
  url: 'http://api.worldweatheronline.com/premium/v1/weather.ashx',

  constructor: function(container, config, store) {
    this.container = container;
    this.config = config;
    this.store = store;
  },

  getWeather: function() {
    var self = this;
    return utils.request({
      url: this.url,
      data: {
        key: this.config.api_key,
        format: 'json',
        q: 'Vinnitsa,Ukraine',
        num_of_days: 1,
        mca: 'no'
      }
    }).then(function(response) {
      var data = response.data;
      self.store.set('last_executed', Date.now());
      self.store.set('weather', data);
    });
  },

  displayWeather: function(response) {
    var self = this;
    var lastExecuted = this.store.get('last_executed');
    var timePassed = lastExecuted ? Date.now() - lastExecuted : Infinity;
    var cachedWeather = this.store.get('weather');

    var data = timePassed < this.config.freq
      ? Promise.resolve(cachedWeather)
      : this.getWeather();

    data.then(function(weather) {
      var scope = {

      };
      self.container.innerHTML = self.template(weather);
    });
  }
});
