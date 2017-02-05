var Page = require('../core/Page');

var Buttons = require('../components/Buttons');

module.exports = Page.extend({
  selectors: {
    lightsContainer: '.lights-container'
  },

  events: {
    'configuration': 'updateLights',
    'lights:update': 'updateLights'
  },

  classNames: {
    lightButton: 'light-button',
    iconLightButton: 'icon-light',
    iconLightButtonActivated: 'icon-light-activated'
  },

  constructor: function(container, store, socket, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.config = config;
    this.socket = socket;
    this.allLights = new Buttons(this.elements.lightsContainer);
    this.allLights.on('switch', this.switchLight.bind(this));
  },

  updateLights: function(event) {
    var lights = event.detail.lights;
    if (lights) {
      Object.keys(lights).forEach(function(lightId) {
        var light = lights[lightId];
        light.className = this.classNames.lightButton;
        light.iconClass = this.classNames.iconLightButton;
        light.activatedIconClass = this.classNames.iconLightButtonActivated;
        light.id = lightId;
      }, this);
      this.allLights.setButtons({ buttons: lights });
    }
  },

  switchLight: function(e) {
    var light = e.detail[0];
    this.socket.emit('switchLight', [{
      id: light.id,
      state: light.state
    }]);
  }
});
