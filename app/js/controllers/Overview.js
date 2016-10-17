var Page = require('../core/Page');
var Weather = require('../components/Weather');
var Time = require('../components/Time');

var utils = require('../lib/utils');

module.exports = Page.extend({
  selectors: {
    weatherContainer: '.weather-container',
    timeContainer: '.time-container',
    powerControls: '.power-controls'
  },

  events: {
    'click powerControls': 'handlePowerButtons'
  },

  constructor: function(container, store, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.store = store;
    this.config = config;
    this.weather = new Weather(this.elements.weatherContainer, config.weather, store.substore('weather'));
    this.time = new Time(this.elements.timeContainer);
  },

  handlePowerButtons: function(e) {
    var action = e.target.getAttribute('data-action');
    if (action) {
      utils.request({ url: '/system/' + action });
    }
  }
});
