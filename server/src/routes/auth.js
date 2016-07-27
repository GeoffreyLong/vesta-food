var passport = require('passport');
var express = require('express');
var router = express.Router();

router.get('/session', function(req, res) {
  var session = {};
  session.user = req.user;
  session.address = req.session.address;
  res.send(session);
});

// Deprecate this... Only poll session to get user info as well
router.get('/login', function(req, res) {
  res.send(req.user);
});


// Passport Router
router.get('/facebook',
  passport.authenticate('facebook', {
    scope: [
      'public_profile',
      'email',
      'user_friends'
    ]
  })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect: '/splogin'
  }), function(req, res) {
    res.redirect('/');
  }
);

router.get('/logout', function(req, res){
  // TODO error handling here and on the front end side of this
  req.logout();
  res.status(200).send("");
});

module.exports = router;
