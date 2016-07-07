var mongoose = require('mongoose');
 
var FoodReview = mongoose.model('FoodReview', {
  foodId: String,
  userId: String,
  date: Date,
  overall: Number,
  comment: String
});

module.exports = FoodReview;
