var passport = require('passport');
var express = require('express');
var router = express.Router();

router.get('/session', function(req, res) {
  var session = {};
  session.user = req.user;
  session.address = req.session.address;
  console.log(session);
  res.send(session);
});

// Deprecate this... Only poll session to get user info as well
router.get('/login', function(req, res) {
  res.send(req.user);
});


// Passport Router
// Add scope?
// TODO add /api to this... everything needs to be /api/<route>
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect: '/splogin'
  }), function(req, res) {
    res.redirect('/');
  }
);

router.get('/logout', function(req, res){
  req.logout();
  res.status(200).send("");
});

module.exports = router;
