var Page = require('./core/Page');
var Store = require('./core/Store');
var utils = require('./lib/utils');
var controllers = require('./controllers/all');

var config = require('../../config');

module.exports = Page.extend({
  selectors: {
    container: '.container'
  },

  initialize: function() {
    this.constructor.__super__.constructor.apply(this, arguments);

    this.store = Store.register('app');
    this.config = config;

    this.controllers = [];
    utils.arr(this.container.children).forEach(function(child) {
      var controllerName = child.getAttribute('data-page');
      var controller = new controllers[controllerName](child, this.store, this.config);
      this.controllers.push(controller);
    }, this);
  }
});
