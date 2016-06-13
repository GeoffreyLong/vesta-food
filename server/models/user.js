var mongoose = require('mongoose');
 
module.exports = mongoose.model('User', {
    fbID: String,
    fbAcessToken: String,
    email: String,
    displayName: String,
    firstName: String,
    lastName: String
});
