var moment = require('moment');

var Base = require('../core/Base');

module.exports = Base.extend({
  template: require('templates/components/time'),

  day: 'dddd',
  date: 'Do MMMM',
  time: 'HH:mm',
  freq: 1000,

  constructor: function(container, config) {
    this.container = container;
    this.config = config;
    this.update = true;
    this._update();
  },

  displayTime: function() {
    var now = moment();
    this.container.innerHTML = this.template({
      day: now.format(this.day),
      date: now.format(this.date),
      time: now.format(this.time)
    });
  },

  _update: function() {
    if (this.update) {
      this.displayTime();
      setTimeout(this._update.bind(this), this.freq);
    }
  }
});
