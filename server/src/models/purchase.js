var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  buyerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  storeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
  foods: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    },
    quantity: Number
  }],
  stripeCharge: mongoose.Schema.Types.Mixed,
  stripeToken: mongoose.Schema.Types.Mixed
});

module.exports.create = function (purchase) {
  return new Purchase(purchase).save();
};

module.exports.allByStore = function (storeId) {
  return Purchase
    .where('storeId', storeId)
    .populate({
      path: 'foods',
      populate: {
        path: 'id',
        model: 'Food'
      }
    })
    .find()
    .exec();
};

module.exports.allByUser = function (userId) {
  return Purchase
    .where('buyerId', userId)
    .populate({
      path: 'foods',
      populate: {
        path: 'id',
        model: 'Food'
      }
    })
    .find()
    .exec();
};
