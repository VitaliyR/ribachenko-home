const log = require('loggy');
const exec = require('child_process').exec;

/**
 * Executes provided script/command
 * @param  {String} command
 */
const execute = function(command) {
  return new Promise((resolve, reject) => {
    exec(command, function(error, stdout, stderr) {
      if (error) {
        log.error(stdout);
        reject(error);
      } else {
        resolve(stdout, stderr);
      }
    });
  });
};

module.exports = execute;
