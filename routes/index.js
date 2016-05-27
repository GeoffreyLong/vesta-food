// Do I need to pass in passport... better way?
module.exports = function(passport){
  // TODO
  //  Pull out the db existance check logic into an fn
  //  READ: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs


  var express = require('express');
  var router = express.Router();

  var mongoose = require('mongoose');
  var mongo = require('mongodb');

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

  router.get('/splogin', function(req, res){
    res.render('splogin');
  });

  var authenticate = function(req, res, next) {
    // Might offer some cross browser stuff?
    // res.header('Access-Control-Allow-Credentials', true);
    console.log('Authenticating');
    if (req.isAuthenticated()) { return next(); }
    console.log('Not Authenticated');
    res.redirect('/splogin')
  };

  /* GET home page. */
  router.get('/', authenticate, function(req, res) {
    res.render('index');
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
  router.post('/newsletter', function(req, res) {
    var newEmail = req.body.email;
    console.log('User email address entered is ' + newEmail);

    // Upsert ensures that only adds if doesn't exist
    EarlyUsers.find({email: newEmail}, function(err, found) {
      if (err){
        console.log(err);
        res.status(500).send(err);
      }
      
      // In this case a user did not exist
      // Add the new user to the database
      if (found == 0){
        new EarlyUsers({
          email: newEmail
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
