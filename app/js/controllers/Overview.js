var Page = require('../core/Page');
var Weather = require('../components/Weather');
var Time = require('../components/Time');
var Buttons = require('../components/Buttons');

module.exports = Page.extend({
  selectors: {
    weatherContainer: '.weather-container',
    timeContainer: '.time-container',
    buttonsContainer: '.buttons-container'
  },

  events: {
    'configuration': 'update',
    'lights:update': 'update'
  },

  classNames: {
    homeButton: 'home-button',
    iconHomeButton: 'icon-home',
    iconHomeButtonActivated: 'icon-home-activated',
    lightButton: 'light-button',
    iconLightButton: 'icon-light',
    iconLightButtonActivated: 'icon-light-activated'
  },

  constructor: function(container, store, socket, config) {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.config = config;
    this.socket = socket;
    this.weather = new Weather(this.elements.weatherContainer, config.weather, store.substore('weather'));
    this.time = new Time(this.elements.timeContainer);
    this.buttons = new Buttons(this.elements.buttonsContainer, {
      buttons: [{
        id: 0,
        name: 'At home|Out of home',
        state: false,
        className: this.classNames.homeButton,
        iconClass: this.classNames.iconHomeButton,
        activatedIconClass: this.classNames.iconHomeButtonActivated
      }, {
        id: 1,
        name: 'Lights on|Lights off',
        state: false,
        className: this.classNames.lightButton,
        iconClass: this.classNames.iconLightButton,
        activatedIconClass: this.classNames.iconLightButtonActivated
      }]
    });
    this.buttons.on('switch', this.switch.bind(this));
  },

  update: function(event) {
    var lights = event.detail.lights;
    var home = event.detail.home;

    if (lights && lights[0]) {
      this.buttons.config.buttons[1].state = lights[0].state;
    }

    if (home) {
      this.buttons.config.buttons[0].state = home.atHome;
    }

    this.buttons.render();
  },

  switch: function(e) {
    var button = e.detail[0];

    if (button.id === 0) {
      this.socket.emit('switchHome', {
        state: button.state
      });
    } else {
      this.socket.emit('switchLight', [{
        id: 0,
        state: button.state
      }]);
    }
  }

});
