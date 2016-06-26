console.log("hello world!");
var mongoose = require('mongoose');


var Users = require('../models/user');
var usersArray = require('./db_population/users.js');
var Stores = require('../models/store');
var storesArray = require('./db_population/stores.js');

// Require that we be in development mode 
// NOTE might want a 'test' mode down the road
var config = require('../config');
config = config['development'];

// Start up the DB
mongoose.connect(config.database.url, function (error) {
  if (error) {
      console.log(error);
  }
  else{
    console.log('Successfully Connected');
    addUsers();
  }
});

var addUsers = function(){
  // Remove all users and add in the test users
  Users.remove({}, function(err){
    Users.collection.insert(usersArray, function(err, docs) {
      if (err){
        console.log(err);
        console.log("Failed to initialize Users");
      }
      else {
        console.log("Added Users: " + docs.insertedIds);

        var pairings = [];
        docs.insertedIds.forEach(function(userId, index){
          var pair = {};
          pair.userId = userId;
          pairings.push(pair);
        });
        // Pass the _ids of the created users on for future refs
        // May want to pass the whole docs if need be
        addStores(pairings);
      }
    });
  })
}

// TODO need to add in test stores
var addStores = function(pairings){
  // Remove all stores and add in the test stores
  Stores.remove({}, function(err){
    Stores.collection.insert(storesArray, function(err, docs) {
      if (err){
        console.log(err);
        console.log("Failed to initialize Stores");
      }
      else {
        console.log("Added Stores: " + docs.insertedIds);

        // Pair up the stores and the users
        var newPairs = [];
        docs.insertedIds.forEach(function(storeId, index){
          // There will always be more users than stores
          var pair = pairings[index];
          pair.storeId = storeId;
          newPairs.push(pair);
        });

        updatePairs(newPairs);
      }
    });

  })


}


var updatePairs = function(pairs) {
  pairs.forEach(function(pair, index){
    Users.findByIdAndUpdate(pair.userId, { storeId: pair.storeId }, function(err, user){
      if (err) {
        console.log(err);
        console.log("Failed to update user: " + pair.userId + " with store: " + pair.storeId);
      }
      else {
      }
    });

    Stores.findByIdAndUpdate(pair.storeId, { userId: pair.userId }, function(err, store){
      if (err) {
        console.log(err);
        console.log("Failed to update store: " + pair.storeId + " with user: " + pair.userId);
      }
      else {
      }
    });
  });
/*
    // Populate the userIds of the stores
    storesArray.forEach(function(store, index){
      // NOTE This will not add it as type ObjectId
      //      Perhaps that is preferred?
      var userId = userIds[index]
      store.userId = userId;

      store.save(function (err, store){
        else {

        }
      });
    });
*/



        // TODO add reviews?
        // addReviews(docs.insertedIds);
}

