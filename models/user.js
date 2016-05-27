var mongoose = require('mongoose');
 
module.exports = mongoose.model('User', {
    fbID: String,
    fbAcessToken: String,
    email: String,
    firstName: String,
    lastName: String
});
