module.exports = function(passport){
  var FacebookStrategy   = require('passport-facebook').Strategy;
  var User = require('../models/user');

  // Get the correct configuration down
  var config = require('../config');
  config = config[process.env.NODE_ENV] || config['development'];

	passport.use(new FacebookStrategy({
                  clientID: config.facebook.appID,
                  clientSecret:config.facebook.appSecret,
                  callbackURL: config.facebook.callbackUrl
              }, function(access_token, refresh_token, profile, done) { 
    process.nextTick(function () {
      User.findOne({ 'fbID' :  profile.id }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
          console.log(user);
          return done(err);
        }

        if (user) {
          // if the user is found, then log them in
          console.log(user);
          return done(null, user); // user found, return that user
        } 
        else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();

          console.log(profile);

          // set all of the facebook information in our user model
          newUser.fbID    = profile.id; // set the users facebook id                 
          newUser.fbAccessToken = access_token; // we will save the token that facebook provides to the user                    
          newUser.firstName  = profile.name.givenName;
          newUser.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
          if (profile.emails) newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
          newUser.displayName = profile.displayName

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
