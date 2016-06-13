var express = require('express');
var router = express.Router();

// get user by id
router.get('/:username', (req, res) => {

});

// update to seller
router.patch('/:username', (req, res) => {
  console.log('here');
  var username = req.username;

  console.log(username + ':' + req.params.scope + ':' + req.params.code);
  // TODO stripe api
  // send current user
  res.json(200);
});

module.exports = router;
