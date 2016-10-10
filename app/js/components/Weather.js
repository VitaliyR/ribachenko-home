var Base = require('../core/Base');
var utils = require('../lib/utils');

module.exports = Base.extend({
  url: 'http://api.worldweatheronline.com/premium/v1/weather.ashx',

  constructor: function(container, key, store) {
    this.container = container;
    this.key = key;
    this.store = store;
  },

  getWeather: function() {
    return utils.request({
      url: this.url,
      data: {
        key: this.key,
        format: 'json',
        q: 'Vinnitsa,Ukraine',
        num_of_days: 1,
        mca: 'no'
      }
    });
  },

  displayWeather: function(response) {
    var self = this;

    this.getWeather().then(function(response) {
      var data = response.data;
      var now = data.current_condition[0];
      self.container.innerHTML = now.temp_C;

      // data.current_condition[0]
      // data.current_condition.temp_C
      // data.current_condition.FeelsLikeC
      // data.current_condition.windspeedKmph
      // data.current_condition.weatherIconUrl[0]
      //
      // // data.weather.forEach
      // data.weather
    });
  }
});
