var mongoose = require('mongoose');
 
var Store = mongoose.model('Store', {
  userID: String,
	storeTitle: String,
	profilePhoto: String,
	pickupAddress: {
    formatted: String,
    lat: Number,
    lng: Number
  },
	neighborhood: String,
	stripe: {
    access_token: String,
    livemode: Boolean,
    refresh_token: String,
    token_type: String,
    stripe_publishable_key: String,
    stripe_user_id: String,
    scope: String
  },
	description: String,
	availability: String,
	overallRating: Number,
	foods: [{
    name: String,
    photo: String,
    price: Number,
    description: String,
    shelfLife: Number,
    prepTime: Number,
    overallRating: Number
  }]
});

module.exports = Store;
