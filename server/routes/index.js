// Do I need to pass in passport... better way?
module.exports = function(passport){
  // TODO
  //  Pull out the db existance check logic into an fn
  
  var express = require('express');
  var router = express.Router();
  var request = require('request');

  // Get the correct configuration down
  var config = require('../../server/config');
  config = config[process.env.NODE_ENV] || config['development'];


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


  // This endpoint is for when the user enters an address in the front page
  // It will store the address in the session object for later authentications
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

    request('https://maps.googleapis.com/maps/api/geocode/json?'
              + 'address=' + searchAddress
              + '&key=' + config.googleMaps.serverKey, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // TODO do something with the geocoords
       }
    })

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
