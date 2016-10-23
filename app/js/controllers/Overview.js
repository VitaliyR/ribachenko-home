var Page = require('../core/Page');
var Weather = require('../components/Weather');
var Time = require('../components/Time');
var Lights = require('../components/Lights');

module.exports = Page.extend({
  selectors: {
    weatherContainer: '.weather-container',
    timeContainer: '.time-container',
    lightsContainer: '.lights-container'
  },

  constructor: function(container, store, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.store = store;
    this.config = config;
    this.weather = new Weather(this.elements.weatherContainer, config.weather, store.substore('weather'));
    this.time = new Time(this.elements.timeContainer);
    this.lights = new Lights(this.elements.lightsContainer);
  }
});
