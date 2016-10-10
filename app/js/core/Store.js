/**
 * @module app/js/core
 */

var Base = require('./Base');

/**
 * @class SubStore
 */
var SubStore = Base.extend({
  constructor: function(namespace, store, data) {
    data && Object.keys(data).forEach(function(key) {
      this[key] = data[key];
    }, this);
    this._type = 'substore';

    Object.defineProperties(this, {
      '_store': {
        value: store,
        enumerable: false
      },
      'namespace': {
        value: namespace,
        enumerable: false
      }
    });
  },

  get: function(key) {
    return this[key];
  },

  set: function(key, value) {
    this[key] = value;
    this._store.persist();
  },

  toString: function() {
    return '[Store SubStore]';
  }
});

/**
 * @class Store
 * @export
 */
var Store = module.exports = Base.extend({

  /**
   * @constructor
   * @param {string} namespace
   */
  constructor: function(namespace) {
    this.namespace = namespace;

    try {
      this.data = JSON.parse(localStorage.getItem(namespace)) || {};
      Object.keys(this.data).forEach(function(key) {
        if (this.data[key]._type === 'substore') {
          this.data[key] = new SubStore(key, this, this.data[key]);
        }
      }, this);
    } catch (e) {
      this.data = {};
    }
  },

  /**
   * Get data from storage
   * @param {string} key
   * @returns {*}
   */
  get: function(key) {
    return this.data[key];
  },

  /**
   * Set data to storage and persist it
   * @param {string} key
   * @param {*} data
   */
  set: function(key, data) {
    this.data[key] = data;
    this.persist();
  },

  /**
   * Saves data to localStorage
   */
  persist: function() {
    var data = JSON.stringify(this.data);
    localStorage.setItem(this.namespace, data);
  },

  /**
   * Creates new substore
   * @param  {String} namespace
   * @param {Object} [initialData=]
   * @return {SubStore}
   */
  substore: function(namespace, initialData) {
    var data = this.data[namespace];

    if (!data._type || data._type !== 'substore') {
      data = this.data[namespace] = new SubStore(namespace, this, initialData);
    }

    return data;
  },

  toString: function() {
    return '[Object Store]';
  }

}, {

  /**
   * Returns new exemplar of Store class
   * @param namespace
   */
  register: function(namespace) {
    return new Store(namespace);
  }

});
