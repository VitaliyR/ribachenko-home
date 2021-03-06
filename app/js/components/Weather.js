var moment = require('moment');

var Page = require('../core/Page');
var utils = require('../lib/utils');

module.exports = Page.extend({
  template: require('templates/components/weather'),
  timeRanges: [3, 6, 12, 18],
  timeRange: 12,

  selectors: {
  },

  events: {
  },

  constructor: function(container, config, store) {
    this.container = container;
    this.config = config;
    this.store = store;

    var weather = this.store.get('weather');
    if (weather) {
      weather.forecast.forEach(function(day) {
        day.moment = moment(day.moment);
      });
    }

    this.update = true;
    this._update();
  },

  getWeather: function() {
    var self = this;
    return utils.request({
      url: this.config.api_url,
      data: {
        key: this.config.api_key,
        format: 'json',
        q: 'Vinnitsa,Ukraine',
        days: 2,
        mca: 'no'
      }
    }).then(function(data) {
      data.forecast = data.forecast.forecastday.map(function(day) {
        day.moment = moment(day.date, 'YYYY-MM-DD');
        return day;
      });

      self.store.set('last_executed', Date.now());
      self.store.set('weather', data);
      return data;
    }).catch(function(err) {
      self.store.set('weather', null);
      self.store.set('last_executed', null);
      throw err;
    });
  },

  displayWeather: function() {
    var lastExecuted = this.store.get('last_executed');
    var timePassed = lastExecuted ? Date.now() - lastExecuted : Infinity;
    var cachedWeather = this.store.get('weather');
    var needUpdate = (timePassed > this.config.freq) || !cachedWeather;
    var runner = Promise.resolve();

    if (cachedWeather) {
      runner.then(this._renderWeather.bind(this, cachedWeather));
    }

    needUpdate && runner
      .then(this.getWeather.bind(this))
      .then(this._renderWeather.bind(this));
  },

  _renderWeather: function(weather) {
    var current = weather.current;
    var today = weather.forecast[0].day;
    var scope = {
      current: {
        temp: Math.round(current.temp_c),
        feels: Math.round(current.feelslike_c),
        icon: current.condition.icon,
        wind_direction: current.wind_dir.toLowerCase(),
        updated_at: this.store.get('last_executed')
      },
      mintemp: Math.round(today.mintemp_c),
      maxtemp: Math.round(today.maxtemp_c)
    };
    this.container.innerHTML = this.template(scope);
    this.bind();
  },

  _update: function() {
    if (this.update) {
      this.displayWeather();
      setTimeout(this._update.bind(this), this.config.freq + 1000);
    }
  }
});
