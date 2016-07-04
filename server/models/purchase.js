var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  stripeCharge: {
    
  }
});

module.exports = Purchase;