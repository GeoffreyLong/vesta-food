var mongoose = require('mongoose');
 
var Store = mongoose.model('Store', {
  userId: String,
	storeTitle: String,
	profilePhoto: String,
	description: String,
	availability: String,
	overallRating: Number,
	neighborhood: String,
	pickupAddress: {
    formatted: String,
    lat: Number,
    lng: Number
  },
	stripe: {
    access_token: String,
    livemode: Boolean,
    refresh_token: String,
    token_type: String,
    stripe_publishable_key: String,
    stripe_user_id: String,
    scope: String
  },
	foods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  }]
});

module.exports.create = function (store) {
  return new Store(store).save();
}

module.exports.all = function () {
  return Store
    .find({})
    .populate('foods')
    .exec();
}

module.exports.getById = function (storeId) {
  return Store
    .findById(storeId)
    .populate('foods')
    .exec();
}