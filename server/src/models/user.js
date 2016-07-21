var mongoose = require('mongoose');
var Event = require('./event'); // needed to use query.populate


var User = mongoose.model('User', {
  displayName: String,
  profilePhoto: String,
  fbID: String,
  address: {
    formatted: String,
    lat: Number,
    lon: Number
  },
  description: String,
  stripe: {
    host: {
      access_token: String,
      livemode: Boolean,
      refresh_token: String,
      token_type: String,
      stripe_publishable_key: String,
      stripe_user_id: String,
      scope: String
    }        
  },
  hostedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  attendedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  fbAcessToken: String,
  email: String,
  firstName: String,
  lastName: String
});

module.exports = User;
