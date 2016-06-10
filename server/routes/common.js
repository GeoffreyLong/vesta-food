// A file for commonly used functions

var env = require('../env.json');

exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return env[node_env];
};
