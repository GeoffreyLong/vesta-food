var mongoose = require('mongoose');
 
var StoreReview = mongoose.model('StoreReview', {
  storeId: String,
  userId: String,
  date: Date,
  overall: Number,
  comment: String
});

module.exports = StoreReview;
