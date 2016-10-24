var Page = require('../core/Page');

module.exports = Page.extend({
  template: require('templates/components/lights'),

  constructor: function(container, config) {
    this.container = container;
    this.config = config;
    this.render();
  },

  render: function() {
    var scope = {
      lights: this.config.lights
    };
    this.container.innerHTML = this.template(scope);
  }
});
