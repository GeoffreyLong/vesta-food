var express = require('express');
var request = require('request');
var router = express.Router();
var config = require('./common').config();

var Users = require('../models/user');
var Store = require('../models/store');

var STRIPE_TOKEN_URI = 'https://connect.stripe.com/oauth/token';

// TODO TODO
//      Create a default "user" object with default photo and whatnot
//      This will help for the "edit" phase

//
router.get('/:id', function(req, res) {

});


//
router.post('/becomeChef', function(req, res) {
  console.log(req.body.scope + ' : ' + req.body.code);

  request.post({
    url: STRIPE_TOKEN_URI,
    form: {
      grant_type: 'authorization_code',
      client_id: config.stripe.clientID,
      client_secret: config.stripe.apiKey,
      code: req.body.code
    }
  }, function (stripeError, response, body) {
    if (!stripeError) {
      console.log(body);

      var store = new Store({
        stripe: JSON.parse(body)
      });

      store.save(function (storeError) {
        if (!storeError) {
          console.log("successfully saved store to db");
          console.log(store);
          res.status(200).send();
        }
        else {
          console.log('mongoose error creating store');
          console.log(storeError);
          res.status(500).send(storeError);
        }
      })
    }

    else {
      console.log('stripe error processing client id');
      console.log(stripeError);
      res.status(500).send(stripeError);
    }
  })
});

module.exports = router;
