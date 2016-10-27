var Page = require('../core/Page');

module.exports = Page.extend({
  template: require('templates/components/lights'),

  selectors: {
    lightButtons: '.light-button'
  },

  events: {
    'click lightButtons': 'toggleLight'
  },

  constructor: function(container, config) {
    this.container = container;
    this.config = config || {};
    this.render();
    this.bind();
  },

  render: function() {
    var scope = { lights: this.config.lights };
    this.container.innerHTML = this.template(scope);
  },

  setLights: function(newConfig) {
    this.config = newConfig;
    this.render();
    this.bind();
  },

  toggleLight: function(e) {
    var lightButton = e.currentTarget;
    // var lightId = lightButton.getAttribute('data-id');

    this.processing = true;
    lightButton.classList.add('processing');
    // this.trigger('switch', lightId);
  }
});
