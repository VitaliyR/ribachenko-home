require('./lib/helpers');

var Socket = require('socket.io-client');

var Page = require('./core/Page');
var Store = require('./core/Store');
var utils = require('./lib/utils');
var controllers = require('./controllers/all');
var modals = require('./modals/all');

var Slider = require('./components/Slider');

var config = require('../../config');

module.exports = Page.extend({
  selectors: {
    pagesContainer: '.container',
    modalContainer: '.modal-overlay',
    bubbles: '.bubbles',
    buttons: '.buttons',
    button: '.buttons li'
  },

  events: {
    'click buttons': 'hideButtons',
    'click button': 'switchSlide',
    'transitionend buttons': 'handleTransitionEnd',
    'click': 'handleClick'
  },

  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);

    var self = this;

    this.store = Store.register('app');
    this.config = config;

    if (config.desktop) {
      this.container.style.cursor = 'default';
    }

    this.socket = Socket.connect();
    this.socket.on('configuration', function(config) {
      self.triggerAll(self.controllers, 'configuration', config);
    });
    this.socket.on('lights:update', function(lights) {
      self.triggerAll(self.controllers, 'lights:update', { lights: lights });
    });
    this.socket.on('outlets:update', function(outlets) {
      self.triggerAll(self.controllers, 'outlets:update', { outlets: outlets });
    });

    this.controllers = [];
    utils.arr(this.elements.pagesContainer.children).forEach(function(child) {
      var controllerName = child.getAttribute('data-page');
      var controller = new controllers[controllerName](child, this.store, this.socket, this.config);
      this.controllers.push(controller);
    }, this);

    this.pagesSlider = new Slider(this.elements.pagesContainer, this.elements.bubbles);
    this.pagesSlider.on('switch:slide', this.switchButton.bind(this));

    this.initiateButtons();

    this.elements.modalContainer.style.display = 'none';
  },

  initiateButtons: function() {
    var mgr = new Hammer.Manager(this.container);
    var swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_UP });
    mgr.on('swipe', this.showButtons.bind(this));
    mgr.add(swipe);

    var buttons = this.elements.buttons;
    var buttonsHeight = buttons.getBoundingClientRect().height;
    buttons.style.bottom = this._buttonsHeight = -1 * buttonsHeight + 'px';
  },

  showButtons: function() {
    if (!this.modal && !this._buttonsVisible) {
      this._buttonsAnimFinished = false;
      this._buttonsVisible = true;
      this.elements.buttons.style.bottom = '0';
    }
  },

  hideButtons: function() {
    this.elements.buttons.style.bottom = this._buttonsHeight;
    this._buttonsVisible = false;
  },

  handleClick: function() {
    this._buttonsAnimFinished && this.hideButtons();
  },

  handleTransitionEnd: function() {
    this._buttonsAnimFinished = true;
  },

  switchSlide: function(e) {
    var button = e.currentTarget;
    var dataPage = button.getAttribute('data-page');

    if (dataPage) {
      var slideNumber = Array.prototype.indexOf.call(this.elements.buttons.children, button);
      this.pagesSlider.switchSlide(slideNumber);
    } else {
      var dataModal = button.getAttribute('data-modal');
      if (dataModal) {
        var modal = this.modal = new modals[dataModal](this.elements.modalContainer);
        modal.on('hide', function() { this.modal = null; }.bind(this));
        modal.show();
      }
    }

    this.hideButtons();
  },

  switchButton: function(e) {
    var slide = e.detail;
    for (var i = 0, maxI = this.elements.buttons.children.length; i < maxI; i++) {
      var button = this.elements.buttons.children[i];
      var method = i === slide ? 'add' : 'remove';
      button.classList[method]('selected');
    }
  }
});
