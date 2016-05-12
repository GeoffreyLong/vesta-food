var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var mongo = require('mongodb');


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

var EarlyUsers = mongoose.model('earlyUsers', EarlyUserSchema);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST for newsletter 
 * Occurs when the user enters their email address on the splash page
 */
router.post('/newsletter', function(req, res) {
  var newEmail = req.body.email;
  console.log('User email address entered is ' + newEmail);

  // Upsert ensures that only adds if doesn't exist
  EarlyUsers.update({email: newEmail}, 
                    {upsert: true}, 
                    {$setOnInsert: newEmail},
                    function(err, saved) {
    if (err){
      console.log(err);
      res.status(500).send(err);
    }
    console.log(saved);

    // Should redirect to a second survey
    // This survey would add additional information to the schema
    // Updated via a find by email
    res.redirect("/");
  });
  
  /*
  new EarlyUsers({
    email: newEmail
  }).save(function(err, saved){
    if (err){
      console.log(err);
      res.status(500).send(err);
    }

    // Should redirect to a second survey
    // This survey would add additional information to the schema
    // Updated via a find by email
    res.redirect("/");
  });
  */
});

module.exports = router;
