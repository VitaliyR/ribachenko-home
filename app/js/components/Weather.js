var moment = require('moment');

var Base = require('../core/Base');
var utils = require('../lib/utils');

module.exports = Base.extend({
  template: require('templates/components/weather'),
  url: 'http://api.worldweatheronline.com/premium/v1/weather.ashx',
  timeRange: 12,

  constructor: function(container, config, store) {
    this.container = container;
    this.config = config;
    this.store = store;

    var weather = this.store.get('weather');
    if (weather) {
      weather.weather.forEach(function(day) {
        day.date = moment(day.date);
      });
    }

    this.update = true;
    this._update();
  },

  getWeather: function() {
    var self = this;
    return utils.request({
      url: this.url,
      data: {
        key: this.config.api_key,
        format: 'json',
        q: 'Vinnitsa,Ukraine',
        num_of_days: 2,
        mca: 'no'
      }
    }).then(function(response) {
      var data = response.data;
      var now = moment();
      data.weather = data.weather.map(function(day) {
        return day.hourly.map(function(hour) {
          var date = moment(day.date + ' ' + hour.time.replace('00', ''), 'YYYY-MM-DD HH');
          if (date - now <= 0) return;

          hour.date = date;
          hour.maxtemp = day.maxtempC;
          hour.mintemp = day.mintempC;
          return hour;
        }).filter(function(day) { return day; });
      });
      data.weather = Array.prototype.concat.apply([], data.weather);
      self.store.set('last_executed', Date.now());
      self.store.set('weather', data);
      return data;
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
    var current = weather.current_condition[0];
    var forecast = this.getForecastData(weather);
    var scope = {
      current: {
        temp: current.temp_C,
        feels: current.FeelsLikeC,
        icon: current.weatherIconUrl[0].value,
        wind_direction: current.winddir16Point.toLowerCase(),
        updated_at: this.store.get('last_executed')
      },
      chanceofrain: forecast.rain,
      mintemp: forecast.min,
      maxtemp: forecast.max
    };
    this.container.innerHTML = this.template(scope);
  },

  _update: function() {
    if (this.update) {
      this.displayWeather();
      setTimeout(this._update.bind(this), this.config.freq + 1000);
    }
  },

  getForecastData: function(weather) {
    var rainChance = [];
    var min = [];
    var max = [];
    var now = moment();
    var i = 0;
    var hours = 0;

    while (hours < this.timeRange) {
      var curr = weather.weather[i++];
      hours += curr.date.diff(now, 'hours');
      rainChance.push(curr.chanceofrain);
      min.push(curr.mintemp);
      max.push(curr.maxtemp);
    }

    return {
      rain: Math.max.apply(null, rainChance),
      max: Math.max.apply(null, max),
      min: Math.min.apply(null, min)
    };
  }
});
