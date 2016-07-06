// TODO 
//      Purchases
//      MAJOR TODO TODO 
//          FoodId (store.food[idx]._id) is not a thing in this nested subdocument structure
//          Perhaps food reviews go in the store with the food objects?
//          Will figure this out as the review system gets fleshed out
//          WAIT WHAT???
//              I just checked again and store.food._id is a thing
//              Why did I not find it before...???
//      Check all of this logic 
//          some of the randomization might have caused some items to be missed

console.log("hello world!");
var mongoose = require('mongoose');


var Users = require('../models/user');
var usersArray = require('./db_population/users.js');
var Stores = require('../models/store');
var storesArray = require('./db_population/stores.js');
var StoreReviews = require('../models/storeReview.js');
var storeReviewsArray = require('./db_population/storeReviews.js');
var FoodReviews = require('../models/foodReview.js');
var foodReviewsArray = require('./db_population/foodReviews.js');
var Foods = require('../models/food');
var foodsArray = require('./db_population/foods');

var userIds = [];
var storeIds = [];

// Require that we be in development mode 
// NOTE might want a 'test' mode down the road
var config = require('../config')();

// Start up the DB
mongoose.connect(config.database.url, function (error) {
  if (error) {
      console.log(error);
  }
  else{
    console.log('Successfully Connected');
    insertUsers();
  }
});

var insertUsers = function(){
  // Remove all users and add in the test users
  Users.remove({}, function(err){
    Users.collection.insert(usersArray, function(err, docs) {
      if (err){
        console.log(err);
        console.log("Failed to initialize Users");
      }
      else {
        console.log("Added Users: " + docs.insertedIds);

        userIds = docs.insertedIds;

        var pairings = [];
        docs.insertedIds.forEach(function(userId, index){
          var pair = {};
          pair.userId = userId;
          pairings.push(pair);
        });
        // Pass the _ids of the created users on for future refs
        // May want to pass the whole docs if need be
        insertStores(pairings);
      }
    });
  })
}

var insertStores = function(pairings){
  // Remove all stores and add in the test stores
  Stores.remove({}, function(err){
    Foods.collection.insert(foodsArray, function (err, foodDocs) {
      for (var i = 0; i < storesArray.length; i ++) {
        var store = storesArray[i];
        store.foods = foodDocs.insertedIds;
      }

      Stores.collection.insert(storesArray, function(err, storeDocs) {
        if (err){
          console.log(err);
          console.log("Failed to initialize Stores");
        }
        else {
          console.log("Added Stores: " + storeDocs.insertedIds);
          storeIds = storeDocs.insertedIds;
          // Pair up the stores and the users
          var newPairs = [];
          storeDocs.insertedIds.forEach(function(storeId, index){
            // There will always be more users than stores
            var pair = pairings[index];
            pair.storeId = storeId;
            newPairs.push(pair);
          });

          updatePairs(newPairs);
          insertStoreReviews(newPairs);
        }
      });
    })
  });
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
}

var insertStoreReviews = function(pairs) {
  FoodReviews.remove({}, function(err){
    StoreReviews.remove({}, function(err){
      var numStoreReviews = Math.floor((Math.random() * 25) + 5);
      
      var numReviewOptions = storeReviewsArray.length;
      var numStores = storeIds.length;
      var numUsers = userIds.length;


      for (var i = 0; i < numStoreReviews; i++) {
        // TODO
        //      It would be cool if we also grabbed random indices of food items 
        //      from the store to associate with the review
        // TODO
        //      Also might want to just iterate over the stores to assign 
        //      a random number of store reviews from random users
        //      This way we can check to make sure the reviews aggregation is correct

        var pair = pairs[Math.floor(Math.random() * numStores)];
        var storeId = pair.storeId;
        
        var userId = userIds[Math.floor(Math.random() * numUsers)];
        while (userId == pair.userId) {
          var userId = userIds[Math.floor(Math.random() * numUsers)];
        }

        var review = new StoreReviews(storeReviewsArray[Math.floor(Math.random() * numReviewOptions)]);
        review.userId = userId;
        review.storeId = storeId;
        review.save(function(err, review){
          if (err) {
            console.log("ERROR: " + err);
          }
          else {
            // COOL interesting error
            //      If I do userId and storeId then both default to the same
            //      since they are being changed outside of the scope of this callback
            
            // TODO Temporarily disabled
            // insertFoodReview(review.userId, review.storeId);
          }
        });
      }
    });
  });
}

var insertFoodReview = function(userId, storeId) {
  var numFoodReviews = foodReviewsArray.length;
  
  Stores.findById(storeId, function(err, store){
    if (err) {
      console.log("Couldn't find storeId: " + storeId);
    }
    else {
      var foods = [];
      var numFoods = store.foods.length;
      var numReviews = Math.floor((Math.random() * numFoods) + 1);

      // Generate a random number of food reviews
      for (var i = 0; i < numReviews; i++){
        // Make sure the food being reviewed does not repeat
        var foodNum = Math.floor(Math.random() * numFoods);
        while(foods.indexOf(foodNum) != -1){
          foodNum = Math.floor(Math.random() * numFoods);
        }
        var foodId = store.foods[foodNum]._id;

        // Grab a random review from the possible food review templates
        var review = new FoodReviews(foodReviewsArray[Math.floor(Math.random() * numFoodReviews)]);
        // Add in the required info
        review.userId = userId;
        review.foodId = foodId;
        // Save the food review
        review.save(function(err, review){
          if (err) {
            console.log("ERROR: " + err);
          }
          else {
            console.log(review);
          }
        });
      }
    }
  });
}

