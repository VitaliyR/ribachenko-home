var Page = require('../core/Page');
var Weather = require('../components/Weather');

module.exports = Page.extend({
  initialize: function(container, store, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.weather = new Weather(config.weather_api_key);
  },

  getWeather: function() {
    // this.weather.getWeather
  }
});
