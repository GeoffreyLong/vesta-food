
// Login is required for store purchases
var requireLogin = function(req, res, next) {
  if (req.isAuthenticated()) {
    // User exists, send user info to angular
    console.log("Is Authenticated");
    next();
  }
  else {
    console.log('Not Authenticated');

    // TODO Give them to some sort of login
    // Don't want to redirect to splogin, want one on page
  }
}

// Sessions are required on everything but splogin
var requireSession = function(req, res, next) {
  // Check to see if the user is logged in
  //    or if the user has previously entered a search address
  if ((req.user && req.user.fbID) || req.session.address) {
    // User session exists, send user info to angular
    console.log("Found session");
    next();
  }
  else {
    console.log("No session");
    // TODO Send the user back to the splogin
  }
};

module.exports = {
  requireLogin: requireLogin,
  requireSession: requireSession
}