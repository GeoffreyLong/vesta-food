var mongoose = require('mongoose');
var User = require('./user'); // needed to use query.populate
var Food = require('./food');

var Event = mongoose.model('Event', {
  name: String,
  description: String,
  startDateTime: Date,
  endDateTime: Date,  
  address: {
    formatted: String,
    lat: Number,
    lng: Number
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  foods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  }],
  invitees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: String
  }],
  orderCutoffTime: Date,
  isOpen: Boolean,
  confirmationRequired: Boolean,
  privacy: String,
  photos: [String],
  rating: Number,
});

module.exports = Event;
