angular
  .module('authService', [])
  .factory("authService", ["$location", "$http", "$q", "$window",
    function ($location, $http, $q, $window) {
      var session;

      function fblogin() {
        // I don't see this working another way due to cross origin scripting issues
        // Would be better to use $http.get though
        // TODO could probably do away with passportJS and simply do client side FB Auth
        window.location = "/api/auth/facebook"
      }

      function logout() {
        $http.get("/api/auth/logout").then(function (result) {
          session = null;
          $location.path("/splash");
        }, function (error) {

        });
      }

      // If we know the session object exists and don't think we need to defer
      function getSessionSynch(){
        return session;
      }

      function getSession() {
        var deferred = $q.defer();
        if (session && (session.address || (session.user && session.user._id))) {
          deferred.resolve(session);
        }
        else {
          getSessionFromDB().then(function(session){
            if (session && (session.address || (session.user && session.user._id))) {
              deferred.resolve(session);
            }
            else {
              deferred.reject({sessioned: false}); 
            }
          }, function(err){
            deferred.reject({sessioned: false});
          });
        }
        return deferred.promise;
      }

      // Gets the session object but doesn't update for stores
      function getUserSession() {
        var deferred = $q.defer();
        if (session && session.user && session.user._id) {
          deferred.resolve(session);
        }
        else {
          getSessionFromDB().then(function(session){
            if (session && session.user && session.user._id) {
              deferred.resolve(session);
            }
            else{
              deferred.reject({user: false});
            }
          }, function(err){
            deferred.reject({user: false});
          });
        }
        return deferred.promise;
      }

      
      // Gets the full session object
      // TODO deprecate in favor of getStripedSession
      function getStoreSession() {
        var deferred = $q.defer();
        if (session && session.user && session.user.storeId) {
          deferred.resolve(session);
        }
        else {
          getSessionFromDB().then(function(session){
            if (session && session.length !== 0 && session.user && session.user.storeId) {
              deferred.resolve(session);
            }
            else{
              deferred.reject({store: false});
            }
          }, function(err){
            deferred.reject({store: false});
          });
        }
        return deferred.promise;
      }

      // Gets the full session object
      function getStripedSession() {
        var deferred = $q.defer();
        if (session && session.user && session.user.hostStripe) {
          deferred.resolve(session);
        }
        else {
          getSessionFromDB().then(function(session){
            if (session && session.length !== 0 && session.user && session.user.hostStripe) {
              deferred.resolve(session);
            }
            else{
              deferred.reject({striped: false});
            }
          }, function(err){
            deferred.reject({striped: false});
          });
        }
        return deferred.promise;
      }


      function getSessionFromDB(){
        var deferred = $q.defer();

        $http.get("/api/auth/session").then(function (result) {
            session = result.data;
            deferred.resolve(session);
            // TODO could speed up using session storage
            //    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
        }, function (error) {
          // TODO redirect to "Temporary Maintanence page or something"
          console.log("server out");
          deferred.reject({retrieved: false});
        });

        return deferred.promise;
      }


      function storeEditAuth(){
        // NOTE might not be the best way to handle the path...
        //      Seems rather shotty to me...
        // TODO make this extensible to other things needing a store
        //      put the matching paths regex in private fn?
        var re = new RegExp("\/store\/(.*)\/edit");
        var storeId = re.exec($location.path())[1];

        // Check to see if session exists
        // If it does and getSession is called then no promise is returned => error
        if (session && (session.address || (session.user && session.user._id))) {
          if (session && session.user && storeId
            && (session.user.storeId == storeId)) {
            return session;
          }
        }

        var deferred = $q.defer();
        getStoreSession().then(function(session){
          if (session && session.user && storeId
            && (session.user.storeId == storeId)) {
            deferred.resolve(session)
          }
          else {
            return deferred.reject({storeOwner: false});
          }
        }, function(err) {
          return deferred.reject({storeOwner: false});
        });
        return deferred.promise;
      }

      function profileEditAuth(){
        // NOTE might not be the best way to handle the path...
        //      Seems rather shotty to me...
        // TODO make this extensible to other things needing a store
        //      put the matching paths regex in private fn?
        var re = new RegExp("\/user\/(.*)\/edit");
        var userId = re.exec($location.path())[1];

        // Check to see if session exists
        // If it does and getSession is called then no promise is returned => error
        if (session && (session.address || (session.user && session.user._id))) {
          if (session && session.user
            && (session.user._id == userId)) {
            return session;
          }
        }

        var deferred = $q.defer();
        getStoreSession().then(function(session){
          if (session && session.user
            && (session.user._id == userId)) {
            deferred.resolve(session)
          }
          else {
            return deferred.reject({profileOwner: false});
          }
        }, function(err) {
          return deferred.reject({profileOwner: false});
        });
        return deferred.promise;
      }


      function init() {
        if ($window.sessionStorage["userInfo"]) {
          userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
      }
      init();

      return {
        fblogin: fblogin,
        logout: logout,
        getSessionSynch: getSessionSynch,
        getSession: getSession,
        getUserSession: getUserSession,
        getStoreSession: getStoreSession,
        getStripedSession: getStripedSession,
        storeEditAuth: storeEditAuth,
        profileEditAuth: profileEditAuth
      };
    }
  ]);
