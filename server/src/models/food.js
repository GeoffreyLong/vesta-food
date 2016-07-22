var mongoose = require('mongoose');
var Store = require('./store');

var Food = mongoose.model('Food', {
  name: String,
  photo: String,
  price: Number,
  blurb: String,
  description: String,
  shelfLife: Number,
  prepTime: Number,
  overallRating: Number,
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  isActive: Boolean,
  isAlive: Boolean
});

module.exports = Food;
