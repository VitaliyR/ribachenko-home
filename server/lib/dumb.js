const log = require('loggy');

const allLights = {
  name: 'Some name',
  state: {
    all_on: false,
    any_on: false
  },
  action: {
    on: false,
    bri: 255,
    hue: 255,
    sat: 255
  }
};

const lights = {
  1: {
    name: 'Some hue light 1',
    state: {
      on: true,
      bri: 200,
      hue: 200,
      sat: 200
    }
  },
  2: {
    name: 'Some hue light 2',
    state: {
      on: false,
      bri: 150,
      hue: 150,
      sat: 150
    }
  }
};

const aLight = (uri) => {
  let light = uri.match(/lights\/(\d+)\//);
  if (light) {
    return Object.assign({}, lights[light[1]]);
  }
  return {};
};

/**
 * Exports
 */
module.exports = function(opts, timeout) {
  const uri = opts.uri;
  let data;

  log.info('Mocking data for uri', uri);

  switch (true) {
    case /groups\/0\/action/.test(uri):
      let state = !allLights.action.on;
      allLights.action.on = state;
      for (let lightId in lights) {
        lights[lightId].state.on = state;
      }
      data = Object.assign({}, allLights);
      break;
    case /groups\/0$/.test(uri):
      data = Object.assign({}, allLights);
      break;
    case /lights$/.test(uri):
      data = Object.assign({}, lights);
      break;
    case /lights\/.+\/state/.test(uri):
      data = aLight(uri);
      data.state.on = !data.state.on;
      break;
  }

  data = data || {};

  return !timeout ? Promise.resolve(data) : new Promise((resolve, reject) => setTimeout(() => resolve(data), timeout));
};
