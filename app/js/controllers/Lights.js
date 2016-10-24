var Page = require('../core/Page');

var Lights = require('../components/Lights');

module.exports = Page.extend({
  selectors: {
    lightsContainer: '.lights-container'
  },

  constructor: function(container, store, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.config = config;
    this.lights = new Lights(this.elements.lightsContainer, {
      lights: [
        { id: 0, isGroup: true, name: 'All lights', state: false },
        { id: 1, isGroup: false, name: '1st Light', state: false },
        { id: 2, isGroup: false, name: '2nd Light', state: true },
        { id: 3, isGroup: false, name: '3rd Light', state: false }
      ]
    });
  }
});
