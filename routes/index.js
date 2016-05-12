var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST for newsletter 
 * Occurs when the user enters their email address on the splash page
 */
router.post('/newsletter', function(req, res) {
  var email = req.body.email;
  console.log('User email address entered is ' + email);
});

module.exports = router;
