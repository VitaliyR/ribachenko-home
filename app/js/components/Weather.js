var moment = require('moment');

var Page = require('../core/Page');
var utils = require('../lib/utils');

module.exports = Page.extend({
  template: require('templates/components/weather'),
  timeRanges: [3, 6, 12, 18],
  timeRange: 12,

  selectors: {
    chanceRain: '.chance-rain'
  },

  events: {
    'click chanceRain': 'switchTimeRange'
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
    var current = weather.forecast[0].hour[moment().hours()];
    var forecast = this.getForecastData(weather);
    var scope = {
      current: {
        temp: Math.round(current.temp_c),
        feels: Math.round(current.feelslike_c),
        icon: current.condition.icon,
        wind_direction: current.wind_dir.toLowerCase(),
        updated_at: this.store.get('last_executed')
      },
      forecastRange: this.timeRange,
      chanceofrain: forecast.rain,
      mintemp: forecast.min,
      maxtemp: forecast.max
    };
    this.container.innerHTML = this.template(scope);
    this.bind();

    var rainChance = forecast.rain;
    rainChance.length === 1 && (rainChance = '0' + forecast.rain);

    this.elements.chanceRain.style.backgroundColor = '';
    var bg = window.getComputedStyle(this.elements.chanceRain).backgroundColor;
    bg = bg.match(/\((.+)\)/)[1].split(',').map(function(e) { return e.trim(); });
    bg[bg.length - 1] = rainChance === 100 ? '100' : '.' + rainChance;
    this.elements.chanceRain.style.backgroundColor = 'rgba(' + bg.join(',') + ')';
  },

  _update: function() {
    if (this.update) {
      this.displayWeather();
      setTimeout(this._update.bind(this), this.config.freq + 1000);
    }
  },

  getForecastData: function(weather) {
    var rainChance = [];
    var temps = [];
    var now = moment();
    var hour = now.hours();
    var hours = 0;
    var day = 0;
    var curr = weather.forecast[day];

    while (hours < this.timeRange) {
      var hr = curr.hour[hour++];
      if (!hr) {
        hour = 0;
        curr = weather.forecast[++day];
        hr = curr.hour[hour];
      }
      ++hours;
      rainChance.push(hr.will_it_rain || hr.will_it_snow);
      temps.push(Math.round(hr.temp_c));
    }

    return {
      rain: Math.round((rainChance.reduce(function(s, e) { return s + e; }, 0) / rainChance.length) * 100),
      max: Math.max.apply(null, temps),
      min: Math.min.apply(null, temps)
    };
  },

  switchTimeRange: function() {
    var curTimeIndex = this.timeRanges.indexOf(this.timeRange);
    var nextTimeRange = this.timeRanges[curTimeIndex + 1] || this.timeRanges[0];
    var weather = this.store.get('weather');

    this.timeRange = nextTimeRange;
    this.displayWeather(weather);
  }
});
