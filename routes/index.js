// Do I need to pass in passport... better way?
module.exports = function(passport){
  // TODO
  //  Pull out the db existance check logic into an fn
  
  var express = require('express');
  var router = express.Router();

  var mongoose = require('mongoose');
  var mongo = require('mongodb');

  var path = require("path");

  // NOTE: Not so sure about this
  // Could just module.exports this auth information... this seems convoluted
  // Does it offer any benefits accessing it in this manner?
  var common = require('./common');
  var config = common.config();


  var Schema = mongoose.Schema;

  var EarlyUserSchema = new Schema({
      email: String,
  });
  var EarlySellerSchema = new Schema({
      firstName: String,
      lastName: String,
      email: String,
      telephone: String,
      pickupLocation: String,
  });

  var EarlyUsers = mongoose.model('earlyUsers', EarlyUserSchema);
  var EarlySellers = mongoose.model('earlySellers', EarlySellerSchema);


  // Sessions are required on everything but splogin
  var requireSession = function(req, res, next) {
    // Check to see if the user is logged in
    //    or if the user has previously entered a search address
    if (req.session && (req.session.address || req.session.user)) {
      console.log("Found session");
      next();
    }
    else {
      console.log("No session");
      res.sendFile(path.resolve('splogin.html'));
    }

  };

  // Login is required for store purchases
  var requireLogin = function(req, res, next) {
    if (req.isAuthenticated()) { 
      return next(); 
    }
    else {
      console.log('Not Authenticated');
      // TODO Give them to some sort of login
      // Don't want to redirect to splogin, want one on page
    }
  };


  /* GET home page. */
  router.get('/', requireSession, function(req, res) {
    res.sendFile(path.resolve('index.html'));
  });


  // Passport Router
  // Add scope?
  router.get('/auth/facebook', passport.authenticate('facebook'));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { 
        successRedirect : '/', 
        failureRedirect: '/splogin' 
    }), function(req, res) {
      res.redirect('/');
    }
  );

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


  /* POST for newsletter 
   * Occurs when the user enters their email address on the splash page
   */
  router.post('/locationSearch', function(req, res) {
    var searchAddress = req.body.searchAddress;
    console.log('Location search entered is ' + searchAddress);
    
    // TODO redirect to the store page application
    //    Basically search the DB for stores with a set distance of the user
    //    If no stores found then send the user a message
    //        Especially if the address is not in Montreal
    //        If this happens then have them enter their email and we will say
    //        that we will come to their neighborhood someday or something
    //    If stores found then redirect to the angular application
    //    TODO figure out how to do that...

    req.session.address = searchAddress

    res.status(200).send(searchAddress);
  });

  /* POST for new sellers 
   * Occurs when the user uses the 'become a seller' modal on the splash page
   */
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

  return router;
};
