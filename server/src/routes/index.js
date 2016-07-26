// Do I need to pass in passport... better way?
module.exports = function(passport){
  // TODO
  //  Pull out the db existance check logic into an fn
  
  var express = require('express');
  var router = express.Router();
  var request = require('request');
  var fs = require('fs');
  var mongoose = require('mongoose');

  // Get the correct configuration down
  var config = require('../config')();
  var _ = require('lodash');

  var Food = require('../models/food.js');
  var Store = require('../models/store.js');
  var Event = require('../models/event.js');
  var User = require('../models/user.js');

  var imageLocation = '../web-client/app';
  var multer = require('multer');
  var storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, imageLocation + '/images/user/tmp/'); 
    },
    /* alternate way of handling tmps
    filename: function(req, file, cb){
      cb(null, 'TMP_' + Date.now());
    }
    */
  });
  var upload = multer({storage: storage});


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


  router.get('/events', function(req, res) {
    // TODO give this locations params too
    
    var date = new Date();
    var query;
    if (req.query.current === 'true') {
      query = Event.find({'endDateTime': {$gt: date}});
    }
    else if (req.query.current === 'false') {
      query = Event.find({'endDateTime': {$lte: date}});
    }
    else {
      query = Event.model.find({});
    }
    
    query.populate('foods').populate('host').then(function(stores) {
        // Default is to send all
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

  router.post('/edit/photo', upload.any('file'), function(req, res) {
    console.log(req.files);
    var photo = req.files[0];

    if (photo && photo.filename) {
      res.status(200).send('/images/user/tmp/' + photo.filename);
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

    // Update the profile photo
    var oldProfPath = store.profilePhoto;
    store.profilePhoto = store.profilePhoto.replace("/tmp/", "/");
    updatePath(oldProfPath, store.profilePhoto);

    // Create an unordered bulk op
    var bulk = Food.collection.initializeUnorderedBulkOp();

    // Create an array to store food ids
    var foodIds = [];

    store.foods.forEach(function(food){ 
      // Update the food photo
      var oldPhoto = food.photo;
      food.photo = food.photo.replace("/tmp/",  "/");
      updatePath(oldPhoto, food.photo);

      // Add to bulk operation
      var id = food._id;
      if (id) {
        foodIds.push(id);
        delete food._id;
        console.log(id);
      }
      bulk.find({'_id': mongoose.Types.ObjectId(id)}).upsert().updateOne(food);
    });

    bulk.execute(function (error, foodDocs) {
      if (error) {
        return res.status(500).send(error);
      }

      // Get the food ids from the foodDocs if upserted
      var newFoods = foodDocs.getUpsertedIds();
      // Need to flatten the array
      newFoods = [].concat.apply([], newFoods);
      newFoods.forEach(function(food){
        if (food._id) {
          foodIds.push(food._id);
        }
      });

      // Add foods field, remove the _id and __v fields
      store.foods = foodIds;
      delete store._id;
      delete store.__v;

      // Set the isValid flag to true
      // This flag means that the object has passed all the client side form validations
      // Therefore it is probably a valid store
      store.isValid = true;

      Stores
        .model
        .findByIdAndUpdate(req.params.storeId, store, {upsert: true})
        .then(function (store) {
          // NOTE will return the old store unless new: true
          req.user.storeId = store._id;
          res.status(200).send(store);
        }, function (storeError) {
          res.status(500).send(storeError);
        });
      });
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


  router.get('/event/:id', function(req, res) {
    Event.findById(req.params.id).populate('foods').populate('host').then(function(event) {
      res.status(200).send(event);
    });
  });

  /**
   * Create or edit store
   */
  router.post('/event/:id', function(req, res) {
    // TODO check for possible errors with the asynchronous fs updates
    //      Could do fs.renameSynch if I don't trust the code
    var event = req.body.data;

    // Update the profile photo
    /*
    var oldProfPath = event.profilePhoto;
    event.profilePhoto = event.profilePhoto.replace("/tmp/", "/");
    updatePath(oldProfPath, event.profilePhoto);
    */

    // Create an unordered bulk op
    var bulk = Food.collection.initializeUnorderedBulkOp();

    // Create an array to store food ids
    var foodIds = [];

    event.foods.forEach(function(food){ 
      // Update the food photo
      var oldPhoto = food.photo;
      food.photo = food.photo.replace("/tmp/",  "/");
      updatePath(oldPhoto, food.photo);

      // Add to bulk operation
      var id = food._id;
      if (id) {
        foodIds.push(id);
        delete food._id;
        console.log(id);
      }
      bulk.find({'_id': mongoose.Types.ObjectId(id)}).upsert().updateOne(food);
    });

    bulk.execute(function (error, foodDocs) {
      if (error) {
        return res.status(500).send(error);
      }

      // Get the food ids from the foodDocs if upserted
      var newFoods = foodDocs.getUpsertedIds();
      // Need to flatten the array
      newFoods = [].concat.apply([], newFoods);
      newFoods.forEach(function(food){
        if (food._id) {
          foodIds.push(food._id);
        }
      });

      // Add foods field, remove the _id and __v fields
      event.foods = foodIds;
      delete event._id;
      delete event.__v;

      // Set the isValid flag to true
      // This flag means that the object has passed all the client side form validations
      // Therefore it is probably a valid store
      event.isValid = true;

      if (req.params.id === "undefined") {
        var eventSave = new Event(event);
        eventSave.save(function(err, event) {
          if (err) {
            res.status(400).send(err);
          }
          else {
            var id = event._id;
            console.log(event.host);
            User.findByIdAndUpdate(
              event.host,
              {$push: {"hostedEvents": event}},
              function(err, model) {
                if (err) {
                  res.status(400).send(err);
                }
                else {
                  res.status(200).send(event);
                }
              }
            );
          }
        });
      }
      else {
        Event.findByIdAndUpdate(req.params.id, event, {upsert: true})
          .then(function (oldEvent) {
            // NOTE will return the old store unless new: true
            event._id = req.params.id;
            res.status(200).send(event);
          }, function (err) {
            res.status(500).send(err);
          });
      }
    });
  });


  return router;
};
