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

        // Pass the _ids of the created users on for future refs
        // May want to pass the whole docs if need be
        addStores(docs.insertedIds);
      }
    });
  })
}

// TODO need to add in test stores
var addStores = function(userIds){
  // Remove all stores and add in the test stores
  var pairs = [{}];
  Stores.remove({}, function(err){
    // Populate the userIds of the stores
    storesArray.forEach(function(store, index){
      // NOTE This will not add it as type ObjectId
      //      Perhaps that is preferred?
      var userId = userIds[index]
      store.userId = userId;

      store.save(function (err, store){
        if (err){
          console.log(err);
          console.log("Failed to initialize Store #" + index);
        }
        else {
          Users.findByIdAndUpdate(userId, { storeId: store._id }, function(err, user){
            if (err) {
              console.log(err);
              console.log("Failed to fetch user ID: " + userId);
            }
            else {
              var pair = {};
              pair.userId = userId;
              pair.storeId = storeId;
            }
          });

        }
      });
    });

    Stores.collection.insert(storesArray, function(err, docs) {
      else {
        console.log("Added Stores: " + docs.insertedIds);



        // TODO add reviews?
        // addReviews(docs.insertedIds);
      }
    });
  })


}
