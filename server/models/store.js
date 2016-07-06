var mongoose = require('mongoose');
var Food = require('./food'); // needed to use query.populate
 
var Store = mongoose.model('Store', {
  userId: String,
	storeTitle: String,
	profilePhoto: String,
	description: String,
	from: Date,
  until: Date,
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
    .find()
    .populate('foods')
    .exec();
}

module.exports.getByUser = function (userId) {
  return Store
    .where('userId', userId)
    .find()
    .populate('foods')
    .exec();
}

module.exports.getById = function (storeId) {
  return Store
    .findById(storeId)
    .populate('foods')
    .exec();
}

module.exports.model = Store;