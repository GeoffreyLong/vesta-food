var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  buyerId: String,
  storeId: String,
  stripeCharge: {}
});

module.exports = Purchase;