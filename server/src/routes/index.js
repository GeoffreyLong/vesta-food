// Do I need to pass in passport... better way?
module.exports = function(passport){
  // TODO
  //  Pull out the db existance check logic into an fn
  
  var express = require('express');
  var router = express.Router();
  var request = require('request');
  var fs = require('fs');

  // Get the correct configuration down
  var config = require('../config')();
  var _ = require('lodash');

  var Food = require('../models/food');
  var Stores = require('../models/store.js');

  var imageLocation = '../web-client/app';
  var multer = require('multer');
  var storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, imageLocation + '/images/tmp/'); 
    },
    /* alternate way of handling tmps
    filename: function(req, file, cb){
      cb(null, 'TMP_' + Date.now());
    }
    */
  });
  var upload = multer({storage: storage});

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

    Stores
      .all()
      .then(function(stores) {
        res.status(200).send(stores);
      }, function (error) {
        res.status(400).send(error);
      });
  });



  router.get('/store/:storeId', function(req, res) {
    Stores
      .getById(req.params.storeId)
      .then(function (store) {
        res.status(200).send(store);
      }, function (storeError) {
        res.status(400).send(storeError);
      });
  });

  router.post('/store/edit/photo', upload.any('file'), function(req, res) {
    console.log(req.files);
    var photo = req.files[0];

    if (photo && photo.filename) {
      res.status(200).send('/images/tmp/' + photo.filename);
    }
    else {
      res.status(500).send('');
    }
  });

  /**
   * Create or edit store
   */
  router.post('/stores/:storeId', function(req, res) {
    // TODO check for possible errors with the asynchronous fs updates
    //      Could do fs.renameSynch if I don't trust the code
    var store = req.body.data;

    var oldProfPath = store.profilePhoto;
    store.profilePhoto = store.profilePhoto.replace("/tmp", "");

    updatePath(oldProfPath, store.profilePhoto);


    store.foods.forEach(function(food){
      var oldPhoto = food.photo;
      food.photo = food.photo.replace("/tmp",  "");
      updatePath(oldPhoto, food.photo);
    });

    Food
      .collection
      .insert(store.foods, function (error, foodDocs) {
        if (error) {
          return res.status(500).send(error);
        }

        store.foods = foodDocs.insertedIds;
        Stores
          .model
          .findByIdAndUpdate(req.params.storeId, store)
          .then(function (store) {
            res.status(200).send(store);
          }, function (storeError) {
            res.status(500).send(storeError);
          });
      });
   
    // {new: false} is unnecessary as it is already false by default
    // I just wanted to emphasize that the object returned is the old object in the db
    // This is so the old photos can be moved to tmp
    // Stores
    //   .model
    //   .findByIdAndUpdate(id, store, {new: false}, function(err, oldStore){
    //   // UNKN
    //   //      For whatever reason, res.send was not calling res.end
    //   //      and the next one was called resulting in an error
    //   if (err) {
    //     console.log(err);
    //     res.status(500).send(err);
    //   }
    //   else {
    //     // Move the photos to the tmp folder
    //     // Alternatively could use timestamps in the titles or in the db
    //     if (store.profilePhoto !== oldStore.profilePhoto){
    //       console.log(spliceTmp(oldStore.profilePhoto));
    //       updatePath(oldStore.profilePhoto, spliceTmp(oldStore.profilePhoto));
    //     }
    //     oldStore.foods.forEach(function(oldFood){
    //       var found = store.foods.some(function(food){
    //         return food.photo === oldFood.photo;
    //       });
    //       if (!found) {
    //         updatePath(oldFood.photo, spliceTmp(oldFood.photo));
    //       }
    //     });
    //     console.log(store);
    //     res.status(200).send("");
    //   }
    // });
  });

  var updatePath = function(oldPath, newPath){
    oldPath = imageLocation + oldPath;
    newPath = imageLocation + newPath;
    if (oldPath !== newPath){
      console.log(oldPath, newPath);
      fs.rename(oldPath, newPath, function(err) {
        if ( err ) console.log('ERROR: ' + err);
      });
    }
  }
  var spliceTmp = function(string) {
    return string.slice(0, 8) + "tmp/" + string.slice(8);
  }

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
