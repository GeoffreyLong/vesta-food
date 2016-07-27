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
// Add scope?
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      if (!user.description || !user.address || !user.profilePhoto){
        console.log(user);
        return res.redirect('/user/' + user._id + '/edit');
      }
      else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
});

router.get('/logout', function(req, res){
  // TODO error handling here and on the front end side of this
  req.logout();
  res.status(200).send("");
});

module.exports = router;
