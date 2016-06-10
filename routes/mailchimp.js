var request = require('request');

var API_KEY = '22c6dadf7c03785e77cfb211d8c5111d-us13';
var BUYER_LIST_ID = '56352af333';
var SELLER_LIST_ID = 'df96afad6b';

var _subscribe = function(listId, user, cb) {
  var url = 'https://us13.api.mailchimp.com/3.0/lists/' + listId + '/members';
  request.post({
    url: url,
    headers: {
      'Authorization': 'vestafood ' + API_KEY,
    },
    form: JSON.stringify(user)
  }, cb);
}

/**
 * @param email
 * @param cb function(err, response, body)
 */
var subscribeBuyer = function(email, cb) {
  console.log('here');
  var subscriber = {
    status: 'subscribed',
    email_address: email
  };

  _subscribe(BUYER_LIST_ID, subscriber, cb);
}

/**
 * @param seller {
 *  email
 *  firstName,
 *  lastLame,
 *  phone,
 *  address
 * }
 *
 * @param cb function(err, response, body)
 */
var subscribeSeller = function(seller, cb) {
  var subscriber = {
    status: 'subscribed',
    email_address: seller.email,
    merge_fields: {
      FNAME: seller.firstName,
      LNAME: seller.lastName
    }
  };

  _subscribe(SELLER_LIST_ID, subscriber, cb);
}

module.exports.subscribeBuyer = subscribeBuyer;
module.exports.subscribeSeller = subscribeSeller;
