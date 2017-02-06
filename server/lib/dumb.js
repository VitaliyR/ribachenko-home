const log = require('./log')('Dumb');

const lightsDumb = require('./dumbs/lights');
const outletsDumb = require('./dumbs/outlets');

/**
 * Exports
 */
module.exports = function(type, opts, timeout) {
  switch (type) {
    case 'lights':
      return lightsDumb(opts, timeout);
    case 'outlets':
      return outletsDumb(opts, timeout);
    default:
      log.warn(`Dumb handler not found for ${type}`);
  }
};
