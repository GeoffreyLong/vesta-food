// A file for commonly used functions

var config = require('../config');

module.exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return config[node_env];
};
