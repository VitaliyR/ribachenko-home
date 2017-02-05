const loggy = require('loggy');

module.exports = (scope) => {
  return new Proxy(loggy, {
    get: (target, name) => {
      return (...args) => {
        scope && (args[0] = `[${scope}] ${args[0]}`);
        return target[name].apply(this, args);
      }
    }
  });
};