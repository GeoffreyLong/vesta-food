console.log("hello world!");
var Users = require('../models/user');
var Store = require('../models/store');
var usersArray = require('./db_population/users.js');
var mongoose = require('mongoose');

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
      
      console.log("Added Users" + docs.insertedIds);

      // Pass the _ids of the created users on for future refs
      // May want to pass the whole docs if need be
      addStores(docs.insertedIds);
    });
  })
}

// TODO need to add in test stores
var addStores = function(userIds){
  // Remove all stores and add in the test stores
  Stores.remove({}, function(err){
    Stores.collection.insert(storesArray, function(err, docs) {
      if (err){
        console.log(err);
        console.log("Failed to initialize Stores");
      }
      
      console.log("Added Stores" + docs.insertedIds);

      // TODO add reviews?
      // addReviews(docs.insertedIds);
    });
  })
}
