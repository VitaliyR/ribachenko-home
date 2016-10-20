var Page = require('../core/Page');

var utils = require('../lib/utils');

module.exports = Page.extend({
  template: require('templates/modals/power'),

  selectors: {
    buttons: '.button'
  },

  events: {
    'click buttons': 'handleButtonClick'
  },

  constructor: function(container) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.render();
  },

  show: function() {
    this.container.style.display = '';
  },

  hide: function() {
    this.container.style.display = 'none';
    this.trigger('hide');
  },

  render: function() {
    this.container.innerHTML = this.template();
    this.bind();
  },

  handleButtonClick: function(e) {
    var button = e.currentTarget;
    var type = button.getAttribute('data-type');

    switch (type) {
      case 'cancel':
        this.hide();
        break;
      case 'reboot':
      case 'shutdown':
        utils.request({ url: '/system/' + type });
        break;
    }
  }
});
