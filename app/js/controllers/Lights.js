var Page = require('../core/Page');

var Lights = require('../components/Lights');

module.exports = Page.extend({
  selectors: {
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
    this.allLights = new Lights(this.elements.lightsContainer);
    this.allLights.on('switch', this.switchLight.bind(this));
  },

  updateLights: function(event) {
    var lights = event.detail;
    this.allLights.setLights({ lights: lights });
  },

  switchLight: function(lightId) {
    this.socket.emit('switchLight', lightId);
  }
});
