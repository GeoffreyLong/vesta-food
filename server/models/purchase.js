var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  buyerId: String,
  storeId: String,
  pickupTime: Date,
  stripeCharge: {}
});

module.exports = Purchase;