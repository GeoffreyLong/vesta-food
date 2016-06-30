var mongoose = require('mongoose');

var Purchase = mongoose.model('Purchase', {
  stripeCharge: {
    
  },
  storeId: String,
  foods: {

  }
});

module.exports = Purchase;