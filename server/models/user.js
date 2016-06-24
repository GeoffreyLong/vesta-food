var mongoose = require('mongoose');
 
var User = mongoose.model('User', {
    fbID: String,
    fbAcessToken: String,
    email: String,
    displayName: String,
    firstName: String,
    lastName: String,
    storeId: String
});

module.exports = User;