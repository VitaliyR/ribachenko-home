const log = require('loggy');
const exec = require('child_process').exec;

/**
 * Executes provided script/command
 * @param  {String} command
 * @param  {Function} [callback=]
 */
const execute = function(command, callback) {
  exec(command, function(error, stdout, stderr) {
    error && log.error(stdout);
  });
};

module.exports = execute;
