var Page = require('../core/Page');

var Buttons = require('../components/Buttons');

module.exports = Page.extend({
  selectors: {
    outletsContainer: '.outlets-container'
  },

  events: {
    'configuration': 'updateOutlets',
    'outlets:update': 'updateOutlets'
  },

  classNames: {
    outletButton: 'outlet-button',
    iconOutletButton: 'icon-outlet',
    iconOutletButtonActivated: 'icon-outlet-activated'
  },

  constructor: function(container, store, socket, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.config = config;
    this.socket = socket;
    this.allOutlets = new Buttons(this.elements.outletsContainer);
    this.allOutlets.on('switch', this.switchOutlet.bind(this));
  },

  updateOutlets: function(event) {
    var outlets = event.detail.outlets;
    if (outlets) {
      outlets.forEach(function(outlet) {
        outlet.className = this.classNames.outletButton;
        outlet.iconClass = this.classNames.iconOutletButton;
        outlet.activatedIconClass = this.classNames.iconOutletButtonActivated;
        outlet.name = outlet.info.sysInfo.alias;
      }, this);
      this.allOutlets.setButtons({ buttons: outlets });
    }
  },

  switchOutlet: function(e) {
    var outlet = e.detail[0];
    this.socket.emit('switchOutlet', [{
      id: outlet.ip,
      state: outlet.state
    }]);
  }
});
