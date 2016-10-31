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
    var lightId = lightButton.getAttribute('data-id');
    var light = this.config.lights[lightId];

    this.processing = true;
    lightButton.querySelector('.icon').className = 'icon icon-spinner';

    this.trigger('switch', [{
      id: lightId,
      state: !light.state
    }]);
  }
});
