var Page = require('../core/Page');

var Lights = require('../components/Lights');

module.exports = Page.extend({
  selectors: {
    lightsContainer: '.lights-container'
  },

  constructor: function(container, store, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.config = config;
    this.allLights = new Lights(this.elements.lightsContainer, {
      lights: [
        { id: 0, isGroup: true, name: 'All lights', state: true }
      ]
    });
  }
});
