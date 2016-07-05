var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  buyerId: mongoose.Schema.Types.ObjectId,
  storeId: mongoose.Schema.Types.ObjectId,
  pickupTime: Date,
  stripeCharge: mongoose.Schema.Types.Mixed
});

module.exports = Purchase;