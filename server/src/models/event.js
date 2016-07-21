var mongoose = require('mongoose');
var User = require('./user'); // needed to use query.populate
var Food = require('./food');

var Event = mongoose.model('Event', {
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startDateTime: Date,
  endDateTime: Date,  
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  description: String,
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
  confirmationRequired: Boolean,
  privacy: String,
  photos: [String],
  rating: Number,
});

module.exports = Event;
