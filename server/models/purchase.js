var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  buyerId: mongoose.Schema.Types.ObjectId,
  storeId: mongoose.Schema.Types.ObjectId,
  pickupTime: Date,
  stripeCharge: mongoose.Schema.Types.Mixed
});

var create = function (purchase) {
  return new Purchase(purchase).save();
}

var allByStore = function (storeId) {
  return Purchase
    .where('storeId', storeId)
    .find()
    .exec();
}

var allByUser = function (userId) {
  return Purchase
    .where('buyerId', userId)
    .find()
    .exec();
}

module.exports = {
  create: create,
  allByStore: allByStore,
  allByUser: allByUser
};