var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {

});

// update to seller
// TODO needs different UPDATE endpoint
router.put('/:id/', function(req, res) {
  console.log(username + ':' + req.params.scope + ':' + req.params.code);

  // TODO stripe api
  // send current user
  res.json(200);
});

module.exports = router;
