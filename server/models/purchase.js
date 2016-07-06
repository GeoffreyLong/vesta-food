var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  buyerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  storeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
  foods: [{type: mongoose.Schema.Types.ObjectId, ref: 'Food'}],
  stripeCharge: mongoose.Schema.Types.Mixed,
  pickupTime: Date
});

var create = function (purchase) {
  return new Purchase(purchase).save();
}

var allByStore = function (storeId) {
  return Purchase
    .where('storeId', storeId)
    .populate('foods')
    .find()
    .exec();
}

var allByUser = function (userId) {
  return Purchase
    .where('buyerId', userId)
    .populate('foods')
    .find()
    .exec();
}

module.exports = {
  create: create,
  allByStore: allByStore,
  allByUser: allByUser
};