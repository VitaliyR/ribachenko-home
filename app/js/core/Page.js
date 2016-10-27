var Base = require('./Base');

module.exports = Base.extend({
  constructor: function(container, store) {
    this.container = container;
    this.store = store;

    if (!this.template) {
      this.bind();
    }
  },

  bind: function() {
    /**
     * @type {Object.<HTMLElement>}
     */
    this.elements = {};

    for (var selectorName in this.selectors) {
      var elements = this.container.querySelectorAll(this.selectors[selectorName]);
      this.elements[selectorName] = elements.length === 1 ? elements[0] : Array.prototype.slice.call(elements);
    }

    this._handlers = {};
    for (var eventDesc in this.events) {
      var event = eventDesc.split(' ');
      var eventName = event[0];
      var eventHandler = this.events[eventDesc];
      var eventObj = event[1];

      if (typeof eventHandler === 'string') {
        eventHandler = this[eventHandler];
      }

      if (eventName === 'init') {
        eventHandler.apply(this);
      } else {
        eventObj = window[eventObj] || this.elements[eventObj];
        if (!eventObj) {
          eventObj = this.container;
        }

        if (eventObj) {
          if (!Array.isArray(eventObj)) {
            eventObj = [eventObj];
          }
          var eventDecl = eventHandler.bind(this);
          eventObj.length && eventObj.forEach(function(obj) {
            obj.addEventListener(eventName, eventDecl);
          }, this);
        }
      }
    }
  },

  trigger: function(event) {
    var args = [this.container].concat(Array.prototype.slice.call(arguments));
    this.triggerOn.apply(this, args);
  },

  triggerAll: function(objs) {
    var args = Array.prototype.slice.call(arguments, 1);
    objs.forEach(function(obj) {
      obj.trigger.apply(obj, args);
    }, this);
  },

  /**
   * Trigger event on objects
   * @param  {Object} obj
   * @param  {string} eventName
   * @returns {CustomEvent}
   */
  triggerOn: function(obj, eventName) {
    var data = Array.prototype.slice.call(arguments, 2);
    var event;

    if (data.length === 1) data = data[0];

    if (window.CustomEvent) {
      event = new CustomEvent(eventName, { detail: data });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, data);
    }

    obj.dispatchEvent(event);

    return event;
  },

  on: function(eventName, fn, ctx) {
    ctx = ctx || this;
    this.container.addEventListener(eventName, fn);
  }
});
