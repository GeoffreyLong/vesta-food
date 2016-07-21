var mongoose = require('mongoose');
var User = require('./user'); // needed to use query.populate

var Location = mongoose.model('Location', {
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  address: {
    formatted: String,
    lat: Number,
    lon: Number
  },
  photos: [String],
  rating: Number
});

module.exports = Location;
