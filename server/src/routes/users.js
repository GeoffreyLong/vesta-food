var express = require('express');
var request = require('request');
var router = express.Router();

var config = require('../config')();
var stripe = require('stripe')(config.stripe.apiKey);
var _ = require('lodash');

var User = require('../models/user');
var Store = require('../models/store');
var Purchase = require('../models/purchase');

var STRIPE_TOKEN_URI = 'https://connect.stripe.com/oauth/token';

// TODO TODO
//      Create a default "user" object with default photo and whatnot
//      This will help for the "edit" phase

/**
 * User info of given user.
 * TODO NOT USED FOR ANYTHING???
 */
router.get('/:userId', function(req, res) {
  User
    .findById(req.params.userId)
    .exec()
    .then(function successCallback(user) {
      res.status(200).send(user);
    }, function errorCallback(error) {
      res.status(500).send(error);
    });
});


/**
 * Purchases made by the given user.
 */
router.get('/:userId/purchases', function (req, res) {
  var buyerId = req.params.userId;
  Purchase.allByUser(buyerId).then(
    function successCallback(purchases) {
      res.status(200).send(purchases);
    }, function errorCallback(error) {
      res.status(500).send(error);
    });
})


/**
 * Create a store for a given user.
 */
router.post('/:userId/store', function(req, res) {
  console.log(req.body.scope + ' : ' + req.body.code);

  request.post({
    url: STRIPE_TOKEN_URI,
    form: {
      grant_type: 'authorization_code',
      client_id: config.stripe.clientId,
      client_secret: config.stripe.apiKey,
      code: req.body.code
    }
  }, function (stripeError, response, body) {
    if (!stripeError) {
      console.log(body);

      Store
        .create({
          stripe: JSON.parse(body),
          userId: req.params.userId,
        })
        .then(function (store) {
          User
            .where('_id', req.params.userId)
            .findOne()
            .exec()
            .then(function successCallback(user) {
              user.storeId = store._id;
              user.save(function (storeError) {
                if (!storeError) {
                  console.log("successfully saved store to db");
                  console.log(store);
                  // Update the parameters for authentication purposes
                  req.user.storeId = store._id;
                  res.status(200).send(store);
                }
                else {
                  console.log("mongoose error saving store");
                  console.log(storeError);
                  res.status(500).send();
                }
              })
            }, function errorCallback(error) {
              console.log("mongoose error finding user");
              console.log("store error");
              res.status(500).send(storeError);
            });
        }, function (storeError) {
          console.log('mongoose error creating store');
          console.log(storeError);
          res.status(500).send(storeError);
        });
    }

    else {
      console.log('stripe error processing client id');
      console.log(stripeError);
      res.status(500).send(stripeError);
    }
  })
});


/**
 * Purchases for a given user's store.
 */
router.get('/:userId/store/purchases', function(req, res) {
  Store
    .getByUser(req.params.userId)
    .then(function successCallback(store) {
      if (store == null) {
        return res.status(404).send('purchases for the requested store can not be found because the requested store does not exist');
      }

      console.log(store);
      var storeId = store._id;
      Purchase
        .allByStore(storeId)
        .then(function successCallback(purchases) {
          res.status(200).send(purchases);
        }, function errorCallback(purchaseError) {
          console.log('purchaseError');
          console.log(purchaseError);
          res.status(500).send(purchaseError);
        });
    }, function errorCallback(storeError) {
      console.log('storeError');
      console.log(storeError);
      res.status(500).send(storeError);
    });
})


/**
 * Create a new order
 * req.body: {
 *  storeId: String
 *  foods: [{
 *    name: String
 *    price: Number
 *
 *  }]
 *  stripePaymentToken
 * }
 */
// TODO TODO TODO TEST WITH MULTIPLE STORES
router.post('/:userId/purchases', function (req, res) {
  var buyerId = req.params.userId;
  var cart = req.body.data.cart;
  var stripePaymentToken = req.body.data.token;


  cart.forEach(function(storeCart){
    var storeId = storeCart.storeId;
    var foods = storeCart.foods;

    var totalCost = 0;
    for (var i = 0; i < foods.length; i++) {
      // times one hundred b/c stripe charges are in cents
      totalCost += foods[i].price * foods[i].quantity * 100;
    }

    var applicationFee = Math.round(totalCost * 0.14);

    Store
      .getById(storeId)
      .then(function (store) {
        var sellerAccountId = store.stripe.stripe_user_id;

        stripe.charges.create({
          amount: totalCost,
          currency: 'cad',
          source: stripePaymentToken.id,
          application_fee: applicationFee,
          destination: sellerAccountId
        }).then(function (charge) {
          //convert to representation that works with database model
          var purchaseFoods = _.map(foods, function (food) {
            return {
              id: food._id,
              quantity: food.quantity
            }
          });

          Purchase.create({
            buyerId: buyerId,
            storeId: storeId,
            foods: purchaseFoods,
            stripeCharge: charge,
            stripeToken: stripePaymentToken
          }).then(function successCallback(purchase) {
            res.status(200).send(purchase);
          }, function errorCallback(purchaseError) {
            console.log('error saving purchase to db');
            console.log(purchaseError);
            res.status(500).send();
          })
        }).catch(function (stripeError) {
          console.log('error creating charge with stripe');
          console.log(stripeError);
          res.status(500).send();
        })
      }, function (storeError) {
        console.log('error finding store by id');
        console.log(storeError);
        res.status(500).send();
      });
  });
});

module.exports = router;
