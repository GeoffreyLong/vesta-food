var express = require('express');
var request = require('request');
var router = express.Router();

var config = require('../config')();
var stripe = require('stripe')(config.stripe.apiKey);
var _ = require('lodash');

var User = require('../models/user');
var Store = require('../models/store');
var Event = require('../models/event');
var Purchase = require('../models/purchase');

var STRIPE_TOKEN_URI = 'https://connect.stripe.com/oauth/token';

var fs = require('fs');
var imageLocation = '../web-client/app';

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


router.post('/:userId', function(req, res) {
  console.log(req.body);
  var user = req.body.data;

  // Update the profile photo
  var oldProfPath = user.profilePhoto;
  user.profilePhoto = user.profilePhoto.replace("/tmp/", "/");
  updatePath(oldProfPath, user.profilePhoto);

  var id = user._id;
  delete user._id;
  delete user.__v;

  User.findByIdAndUpdate(id, user, {new: false}, function(err, oldUser) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      // Move the photos to the tmp folder
      // Alternatively could use timestamps in the titles or in the db
      console.log(user);
      res.status(200).send("");
    }
  });

});

var updatePath = function(oldPath, newPath){
  oldPath = imageLocation + oldPath;
  newPath = imageLocation + newPath;
  if (oldPath !== newPath){
    console.log(oldPath, newPath);
    fs.rename(oldPath, newPath, function(err) {
      if ( err ) console.log('ERROR: ' + err);
    });
  }
}
var spliceTmp = function(string) {
  return string.slice(0, 8) + "tmp/" + string.slice(8);
}



/**
 * Create a store for a given user.
 */
router.post('/:userId/addStripe', function(req, res) {
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

      User.findByIdAndUpdate(req.params.userId, 
                            {"hostStripe": JSON.parse(body)})
          .then(function(user) {
        // Set the user object stripe
        // NOTE consider only adding the stripe field to the existing req.user
        req.user = user;
        res.status(200).send(user);
      }, function(error){
        console.log("Mongoose error updating user");
        res.status(400).send(error);
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
router.post('/:userId/purchases', function (req, res) {
  var buyerId = req.params.userId;
  var subCart = req.body.data;
  var eventId = subCart.eventId;
  var hostId = subCart.hostId;
  var foods = subCart.foods;
  var stripePaymentToken = subCart.token;


  var totalCost = 0;
  for (var i = 0; i < foods.length; i++) {
    // times one hundred b/c stripe charges are in cents
    totalCost += foods[i].price * foods[i].quantity * 100;
  }

  var applicationFee = Math.round(totalCost * 0.14);

  Event
    .findById(eventId).populate('host')
    .then(function (ev) {
      var sellerAccountId = ev.host.hostStripe.stripe_user_id;

      // TODO Could give them a five minute grace period
      if (Date.now() > ev.orderCutoffTime) {
        res.status(500).send(ev.orderCutoffTime);
      }
      else {
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

          var curDate = Date.now();

          Purchase.create({
            buyerId: buyerId,
            eventId: eventId,
            hostId: hostId,
            foods: purchaseFoods,
            completed: Date.now(),
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
      }
    }, function (storeError) {
      console.log('error finding store by id');
      console.log(storeError);
      res.status(500).send();
    });
});


module.exports = router;
