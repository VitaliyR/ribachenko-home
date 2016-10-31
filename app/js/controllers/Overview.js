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

  events: {
    'configuration': 'updateLights',
    'lights:update': 'updateLights'
  },

  constructor: function(container, store, socket, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.config = config;
    this.socket = socket;
    this.weather = new Weather(this.elements.weatherContainer, config.weather, store.substore('weather'));
    this.time = new Time(this.elements.timeContainer);
    this.lights = new Lights(this.elements.lightsContainer, { lights: [{ id: 0, name: 'All Lights' }] });
    this.lights.on('switch', this.switchLight.bind(this));
  },

  updateLights: function(event) {
    var config = event.detail;
    var lights = config.lights || config;

    if (lights[0]) {
      var newLights = { 0: lights[0] };
      this.lights.setLights({ lights: newLights });
    }
  },

  switchLight: function(e) {
    this.socket.emit('switchLight', e.detail);
  }
});
