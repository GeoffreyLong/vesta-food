var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  buyerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  storeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
  foods: [{type: mongoose.Schema.Types.ObjectId, ref: 'Food'}],
  stripeCharge: mongoose.Schema.Types.Mixed,
  stripeToken: mongoose.Schema.Types.Mixed
});

module.exports.create = function (purchase) {
  return new Purchase(purchase).save();
}

module.exports.allByStore = function (storeId) {
  return Purchase
    .where('storeId', storeId)
    .populate('foods')
    .find()
    .exec();
}

module.exports.allByUser = function (userId) {
  return Purchase
    .where('buyerId', userId)
    .populate('foods')
    .find()
    .exec();
}
