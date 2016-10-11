var Hammer = require('hammerjs');

var Page = require('./core/Page');
var Store = require('./core/Store');
var utils = require('./lib/utils');
var controllers = require('./controllers/all');

var config = require('../../config');

module.exports = Page.extend({
  selectors: {
    pagesContainer: '.container',
    bubbles: '.bubbles',
    buttons: '.buttons'
  },

  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);

    this.store = Store.register('app');
    this.config = config;

    this.controllers = [];
    utils.arr(this.elements.pagesContainer.children).forEach(function(child) {
      var controllerName = child.getAttribute('data-page');
      var controller = new controllers[controllerName](child, this.store, this.config);
      this.controllers.push(controller);

      var bubble = document.createElement('div');
      this.elements.bubbles.appendChild(bubble);
    }, this);

    this.elements.bubbles.children[0].classList.add('selected');

    this.addButtonsGesture();
  },

  addButtonsGesture: function() {
    var mgr = new Hammer.Manager(document.body);
    var swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_UP });
    mgr.on('swipe', this.showButtons.bind(this));
    mgr.add(swipe);
  },

  showButtons: function(e) {

  }
});
