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

    // TODO TODO 
    // For images in the stores we might want to consider
    // /images/chefs/:chefId for the personal photos
    // /images/foods/:foodId for the food photos
    // We will have to decide if we want to use something like GridFS with mongo
    //    or just use a file system to save these images
    //    I don't know the benefits of each... will have to weigh pros/cons  
  router.get('/stores', function(req, res) {
    // Basically search the DB for stores with a set distance of the user
    // TODO figure out a good distance... perhaps this is something the user can spec
    //      in the store search sidenav

    console.log("hit stores");

    var stores = [
      {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 1",
        profilePhoto: "/images/chef_1_profile.jpg",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "This is the best store you'll ever go to. I make lots of things.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Hamburger Pastry thingies",
          photo: "/images/chef_1-1.png",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 5
        }, {
          name: "Schwarma Guy Wraps",
          photo: "/images/chef_1-2.jpg",
          price: 8,
          shelfLife: 2,
          prepTime: 4,
          overallRating: 3
        }, {
          name: "Salmon Delight",
          photo: "/images/chef_1-3.jpeg",
          price: 8,
          shelfLife: 1,
          prepTime: 1,
          overallRating: 2
        }]
      }, {
        userID: "111111111",
        storeID: "111111111",
        storeTitle: "Store Des Ipsums",
        profilePhoto: "TODO",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
          + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." 
          + "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Ipsum Salad",
          photo: "/images/chef_2-1.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }, {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Piecaken Nation",
        profilePhoto: "TODO",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "This is the best store you'll ever go to. I make lots of things.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Brittle Peanuts",
          photo: "/images/chef_3-1.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }, {
          name: "Brittle Peanuts",
          photo: "/images/chef_3-2.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }, {
          name: "Brittle Peanuts",
          photo: "/images/chef_3-3.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }, {
          name: "Brittle Peanuts",
          photo: "/images/chef_3-4.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }, {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 4",
        profilePhoto: "TODO",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "This is the best store you'll ever go to. I make lots of things.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Brittle Peanuts",
          photo: "/images/chef_4-1.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }, {
        userID: "8675309",
        storeID: "123454321",
        storeTitle: "Ronald's",
        profilePhoto: "/images/chef_5_profile.jpg",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "I will make you fat, that is a guarantee.", 
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Ipsum Salad",
          photo: "/images/chef_2-1.jpg",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 3
        }]
      }
    ];


    res.status(200).send(stores);

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
