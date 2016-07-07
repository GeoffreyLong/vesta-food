var mongoose = require('mongoose');

var Food = mongoose.model('Food', {
  name: String,
  photo: String,
  price: Number,
  description: String,
  shelfLife: Number,
  prepTime: Number,
  overallRating: Number
});

module.exports = Food;