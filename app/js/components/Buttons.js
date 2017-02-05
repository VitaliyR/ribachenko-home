var Page = require('../core/Page');

module.exports = Page.extend({
  template: require('templates/components/buttons'),

  selectors: {
    button: '.button',
    icon: '.icon'
  },

  classNames: {
    spinner: 'icon icon-spinner'
  },

  events: {
    'click button': 'toggleButton'
  },

  constructor: function(container, config) {
    this.container = container;
    this.setButtons(config || {});
  },

  render: function() {
    var scope = { buttons: this.config.buttons };
    this.container.innerHTML = this.template(scope);
    this.bind();
  },

  setButtons: function(newConfig) {
    this.config = newConfig;
    Object.keys(this.config.buttons || {}).forEach(function(buttonId) {
      var button = this.config.buttons[buttonId];
      var name = button.name.split('|');
      if (name.length > 1) {
        button.name = name[1];
        button.activatedName = name[0];
      } else {
        button.activatedName = button.name;
      }
    }, this);
    this.render();
  },

  toggleButton: function(e) {
    var buttonEl = e.currentTarget;
    var buttonId = buttonEl.getAttribute('data-id');
    var data = this.config.buttons[buttonId];

    this.elements.icon.className = this.classNames.spinner;

    data.state = !data.state;

    this.trigger('switch', [data]);
  }
});
