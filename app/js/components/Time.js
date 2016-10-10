var moment = require('moment');

var Base = require('../core/Base');

module.exports = Base.extend({
  template: require('templates/components/time'),

  date: 'dddd, Do MMMM',
  time: 'HH:mm',

  constructor: function(container, config) {
    this.container = container;
    this.config = config;
    this.update = true;
  },

  update: function() {
    setTimeout(this.displayTime.bind(this))
  },

  displayTime: function() {
    var now = moment();
    this.container.innerHTML = this.template({
      date: now.format(this.date),
      time: now.format(this.time)
    });
  }
});
