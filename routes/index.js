// TODO
//  Pull out the db existance check logic into an fn


var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var mongo = require('mongodb');

var config = require('../config');
config = config[process.env.NODE_ENV] || config['development'];



mongoose.connect('mongodb://localhost/VestaFood', function (error) {
  if (error) {
      console.log(error);
  }
  else{
    console.log('Successfully Connected');
  }
});

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

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { fbAppId: JSON.parse(config.facebook.appID.replace(/&quot;/g,'"')) });
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

module.exports = router;
