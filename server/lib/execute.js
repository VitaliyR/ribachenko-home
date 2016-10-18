const log = require('logger');
const exec = require('child_process').exec;

/**
 * Executes provided script/command
 * @param  {[type]}   command  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const execute = function(command, callback) {
  exec(command, function(error, stdout, stderr) {
    error && log.error(stdout);
  });
};

module.exports = execute;
