var express = require('express');
var request = require('request');
var router = express.Router();

var config = require('./common').config();
var stripe = require('stripe')(config.stripe.apiKey);

var User = require('../models/user');
var Store = require('../models/store');
var Purchase = require('../models/purchase');

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

/**
 * Create a new order
 * req.body: {
 *  storeID: String
 *  foods: [{
 *    name: String
 *    price: Number
 *
 *  }]
 *  paymentToken
 * }
 */
router.post('/purchases', function (req, res) {
  var content = JSON.parse(req.body);
  var storeId = content.storeId;
  var foods = content.foods;
  var stripePaymentToken = content.paymentToken;

  var totalCost = 0;
  for (var food in foods) {
    totalCost += food.price * food.quantity;
  }

  var applicationFee = totalCost * 0.14;

  Store.findById(storeId, function (storeError, store) {
    if (storeError) {
      console.log('error finding store by id');
      console.log(storeError);
      res.status(500).send();
    }
    else {
      var sellerAccountId = store.stripe.stripe_user_id;

      stripe.charges.create({
        amount: totalCost,
        currency: 'cad',
        source: stripePaymentToken,
        application_fee: applicationFee,
        destination: sellerAccountId
      }).then(function (charge) {
        console.log('submitting charge to stripe');
        console.log(charge);
        var purchase = new Purchase({
          //FIXME need to fix model
          stripeCharge: charge,
          storeId: storeId,
          foods: foods
        }).save(function (purchaseError) {
          if (purchaseError) {
            console.log('error saving purchase to db');
            console.log(purchaseError);
            res.status(500).send();
          }
          else {
            console.log
            res.status(200).send();
          }
        })
      }).catch(function (stripeError) {
        console.log('error creating charge with stripe');
        console.log(stripeError);
        res.status(500).send();
      })
    }
  })
})

module.exports = router;
