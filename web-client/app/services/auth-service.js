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

      function getSession(requireUser) {
        if (session && (session.address || (session.user && session.user._id))) {
          return session;
        }
        else {
          var deferred = $q.defer();

          $http.get("/api/auth/session").then(function (result) {
            if ((!requireUser && result.data.address)
              || (result.data.user && result.data.user._id)) {
              session = result.data;
              deferred.resolve(session);
              // TODO could speed up using session storage
              //    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            }
            else {
              if (requireUser) deferred.reject({authenticated: false});
              deferred.reject({sessioned: false});
            }
          }, function (error) {
            // TODO redirect to "Temporary Maintanence page or something"
            console.log("server out");
            deferred.reject({sessioned: false});
          });

          return deferred.promise
        }
      }

      function requireStore() {
        // NOTE might not be the best way to handle the path...
        //      Seems rather shotty to me...
        var re = new RegExp("\/store\/(.*)\/edit");
        var storeId = re.exec($location.path())[1];

        // Check to see if session exists
        // If it does and getSession is called then no promise is returned => error
        if (session && (session.address || (session.user && session.user._id))) {
          if (session && session.user && storeId
            && (session.user.storeId == storeId)) {
            return session;
          }
          else {
            return null;
          }
        }
        else {
          var deferred = $q.defer();
          getSession(true).then(function(session){
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
        getSession: getSession,
        requireStore: requireStore
      };
    }
  ]);