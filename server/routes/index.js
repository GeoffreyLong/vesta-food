// Do I need to pass in passport... better way?
module.exports = function(passport){
  // TODO
  //  Pull out the db existance check logic into an fn
  
  var express = require('express');
  var router = express.Router();

  // var mongoose = require('mongoose');
  // var mongo = require('mongodb');
  //
  // var path = require("path");
  //
  // // NOTE: Not so sure about this
  // // Could just module.exports this auth information... this seems convoluted
  // // Does it offer any benefits accessing it in this manner?
  // var common = require('./common');
  // var config = common.config();
  //
  //
  // var Schema = mongoose.Schema;
  //
  // var EarlyUserSchema = new Schema({
  //     email: String,
  // });
  // var EarlySellerSchema = new Schema({
  //     firstName: String,
  //     lastName: String,
  //     email: String,
  //     telephone: String,
  //     pickupLocation: String,
  // });
  //
  // var EarlyUsers = mongoose.model('earlyUsers', EarlyUserSchema);
  // var EarlySellers = mongoose.model('earlySellers', EarlySellerSchema);


  // // Sessions are required on everything but splogin
  // var requireSession = function(req, res, next) {
  //   // Check to see if the user is logged in
  //   //    or if the user has previously entered a search address
  //   if ((req.user && req.user.fbID) || req.session.address) {
  //     // User session exists, send user info to angular
  //     console.log("Found session");
  //     next();
  //   }
  //   else {
  //     console.log("No session");
  //     // TODO Send the user back to the splogin
  //   }
  //
  // };
  //
  // // Login is required for store purchases
  // var requireLogin = function(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     // User exists, send user info to angular
  //     console.log("Is Authenticated");
  //     next();
  //   }
  //   else {
  //     console.log('Not Authenticated');
  //
  //     // TODO Give them to some sort of login
  //     // Don't want to redirect to splogin, want one on page
  //   }
  // };

  // router.get('/auth/session', requireSession, function(req, res) {
  //   res.send(req.user);
  // });
  // router.get('/auth/login', requireLogin, function(req, res) {
  //   res.send(req.user);
  // });
  //
  //
  // // Passport Router
  // // Add scope?
  // // TODO add /api to this... everything needs to be /api/<route>
  // router.get('/auth/facebook', passport.authenticate('facebook'));
  //
  // router.get('/auth/facebook/callback',
  //   passport.authenticate('facebook', { 
  //       successRedirect : '/', 
  //       failureRedirect: '/splogin' 
  //   }), function(req, res) {
  //     res.redirect('/');
  //   }
  // );
  //
  // router.get('/logout', function(req, res){
  //   req.logout();
  //   // TODO send stuff back
  // });


  router.post('/locationSearch', function(req, res) {
    var searchAddress = req.body.address;
    console.log('Location search entered is ' + searchAddress);

    // TODO add some logic to check if the address is legit either here or client side
    //      I do not believe that we need to search for stores here
    //      We can perform the store search as a part of the '/' route

    // Does this make our REST server stateful?
    // TODO might not want to do this and store in client session store instead?
    
    // NOTE We might want to put address in a larger object that is like search params
    //      Then we can store things like distance and make the searches persistent
    req.session.address = searchAddress

    res.status(200).send(searchAddress);
  });

  router.post('/stores', function(req, res) {
    // Basically search the DB for stores with a set distance of the user
    // TODO figure out a good distance... perhaps this is something the user can spec
    //      in the store search sidenav


  });

  /* POST for new sellers 
   * Occurs when the user uses the 'become a seller' modal on the splash page
   */
  /*
  router.post('/sellerinfo', function(req, res) {
    var newEmail = req.body.email;
    console.log('User email address entered is ' + newEmail);

    // Upsert ensures that only adds if doesn't exist
    EarlySellers.find({email: newEmail}, function(err, found) {
      if (err){
        console.log(err);
        res.status(500).send(err);
      }
      
      // In this case a user did not exist
      // Add the new user to the database
      if (found == 0){
        new EarlySellers({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: newEmail,
          telephone: req.body.telephone,
          pickupLocation: req.body.pickup,
        }).save(function(err, saved){
          if (err){
            console.log(err);
            res.status(500).send(err);
          }

          console.log(newEmail + ' added to the database');
          // Should redirect to a second survey
          // This survey would add additional information to the schema
          // Updated via a find by email
          res.status(200).send(newEmail);

        });
      }
      // In this case a user did exist
      else{
        // NOTE Could consider sending a different status code than 200
        console.log(newEmail + ' is already in the database');
        res.status(200).send('');
      }
    });
  });
*/
  return router;
};
