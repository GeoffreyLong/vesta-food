var express = require('express');
var request = require('request');
var router = express.Router();

var Users = require('../models/user');
var Store = require('../models/store');

var STRIPE_CLIENT_ID = 'ca_89GeQlhMVoUResS0PeQm6XuCs6hoXgze';
var STRIPE_API_KEY = 'sk_test_an3Nezne8XguJAefiBJgNV63';
var STRIPE_TOKEN_URI = 'https://connect.stripe.com/oauth/token';


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
      client_id: STRIPE_CLIENT_ID,
      client_secret: STRIPE_API_KEY,
      code: req.body.code
    }
  }, function (stripeError, response, body) {
    if (!stripeError) {
      console.log(body);

      var store = new Store({
        stripeCredentials: JSON.parse(body)
      });

      store.save(function (storeError) {
        if (!storeError) {
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
