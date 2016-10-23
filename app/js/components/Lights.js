var Base = require('../core/Base');

module.exports = Base.extend({
  template: require('templates/components/lights'),

  constructor: function(container, config) {
    this.container = container;
    this.config = config;
  },

  render: function(scope) {
    this.container.innerHTML = this.template(scope);
  }
});
