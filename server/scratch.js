var request = require('request');

var subscriber = {
  email_address: 'charlielbloomfield@gmail.com',
  status: 'subscribed'
};

request.post({
    url: 'https://us13.api.mailchimp.com/3.0/lists/56352af333/members',
    headers: {
      'Authorization': 'vestafood 22c6dadf7c03785e77cfb211d8c5111d-us13',
    },
    form: JSON.stringify(subscriber)
  }, function (err, response, body) {
    var info = JSON.parse(body);
    if (err || info.status != 200) {
      console.log(body);
      console.log(err);
    }
    else {
      console.log('Successfully added subscriber '
        + JSON.stringify(subscriber) + ' to mailchimp.');
    }
});

// var http = require('http');
//
// var subscriber = JSON.stringify({
//   "email_address": "charlielbloomfield@gmail.com",
//   "status": "subscribed"
//   // "merge_fields": {
//   //   "FNAME": "Tester",
//   //   "LNAME": "Testerson"
//   // }
// });
//
// var options = {
//   host: 'us13.api.mailchimp.com',
//   path: '/3.0/lists/56352af333/members',
//   method: 'POST',
//   headers: {
//     'Authorization': 'vestafood 22c6dadf7c03785e77cfb211d8c5111d-us13',
//     'Content-Type': 'application/json',
//     'Content-Length': subscriber.length
//   }
// }
//
// var hreq = http.request(options, function (hres) {
//   console.log('STATUS CODE: ' + hres.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(hres.headers));
//   hres.setEncoding('utf8');
//
//   hres.on('data', function (chunk) {
//     console.log('\n\n===========CHUNK===============')
//     console.log(chunk);
//   });
//
//   hres.on('end', function(res) {
//     console.log('\n\n=========RESPONSE END===============');
//   });
//
//   hres.on('error', function (e) {
//     console.log('ERROR: ' + e.message);
//   });
// });
//
// hreq.write(subscriber);
// hreq.end();