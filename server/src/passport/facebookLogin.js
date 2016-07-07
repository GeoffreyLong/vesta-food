module.exports = function(passport){
  var FacebookStrategy   = require('passport-facebook').Strategy;
  var User = require('./user');

  // Get the correct configuration down
  var config = require('../config')();

	passport.use(new FacebookStrategy({
                  clientID: config.facebook.appID,
                  clientSecret:config.facebook.appSecret,
                  callbackURL: config.facebook.callbackUrl
              }, function(access_token, refresh_token, profile, done) { 
    process.nextTick(function () {
      User.findOne({ 'fbID' :  profile.id }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
          return done(err);
        }

        if (user) {
          // if the user is found, then log them in
          return done(null, user); // user found, return that user
        } 
        else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();

          // set all of the facebook information in our user model
          newUser.fbID = profile.id; // set the users facebook id                 
          newUser.fbAccessToken = access_token; // we will save the token that facebook provides to the user                    
          newUser.firstName  = profile.name.givenName;
          newUser.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
          if (profile.emails) newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
          newUser.displayName = profile.displayName

          // save our user to the database
          newUser.save(function(err, dbUser) {
            if (err) throw err;

            // If successful, return the new user
            // TODO CHECKS
            //    Check to ensure that this newUser has the _id with it
            //    I would assume it does?
            return done(null, dbUser);
          });
        }
      });
    });
  }));


    
}
