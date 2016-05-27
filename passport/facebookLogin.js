var FacebookStrategy   = require('passport-facebook').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('facebook', new FacebookStrategy({
                  clientID: config.fbAppID,
                  clientSecret:config.fbAppSecret,
                  callbackURL: config.fbCallbackUrl
              }, function(access_token, refresh_token, profile, done) { 
    // Is this "process.nextTick" necessary?
    // I guess it gives some asynch behaviours
    process.nextTick(function () {
      User.findOne({ 'id' :  profile.id }, function(err, user) {
          // In case of any error, return using the done method
          if (err) return done(err);
      
          if (user) {
            // if the user is found, then log them in
            return done(null, user); // user found, return that user
          } 
          else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
 
            // set all of the facebook information in our user model
            newUser.fbID    = profile.id; // set the users facebook id                 
            newUser.fbAccessToken = access_token; // we will save the token that facebook provides to the user                    
            newUser.firstName  = profile.name.givenName;
            newUser.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
 
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, newUser);
            });
          }
      
      });
    });
  }));


    
}
