var Page = require('../core/Page');
var Weather = require('../components/Weather');

module.exports = Page.extend({
  selectors: {
    weatherContainer: '.weather'
  },

  constructor: function(container, store, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.store = store;
    this.config = config;
    this.weather = new Weather(this.elements.weatherContainer, config.weather_api_key, store);

    this.getWeather();
  },

  getWeather: function() {
    this.weather.displayWeather();
  }
});
