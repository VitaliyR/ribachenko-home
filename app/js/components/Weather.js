var Base = require('../core/Base');
var utils = require('../lib/utils');

module.exports = Base.extend({
  url: 'http://api.worldweatheronline.com/premium/v1/weather.ashx',

  initialize: function(key) {
    this.key = key;
  },

  getWeather: function() {
    utils.request({
      url: this.url,
      data: {
        key: this.key,
        format: 'json',
        q: 'Vinnitsa,Ukraine',
        num_of_days: 1,
        mca: false
      },
      success: this.displayWeather
    });
  },

  displayWeather: function(response) {
    var data = response.data;
  }
});
