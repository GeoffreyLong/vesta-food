angular.module('vestaApp')
.config(['$mdThemingProvider', '$locationProvider', '$routeProvider', '$httpProvider',
  function config($mdThemingProvider, $locationProvider, $routeProvider, $httpProvider) {
    // Prevent "No 'Access-Control-Allow-Origin' header is present" errors
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    // This provides some styling
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('blue-grey')
    .warnPalette('orange');

    // TODO decide if this is something we want
    $locationProvider.hashPrefix('!');
    $routeProvider.
      when('/', {
        template: '<vesta-nav></vesta-nav>'
          + '<div id="nonNavContainer" class="sideNavOpen">'
          + '<stores-view></stores-view>'
          + '</div>',
        resolve: {
          // Going to the stores view only requires a session
          auth: function ($q, authService) {
            return authService.getSession();
          }
        }
      })
      .when('/becomeAChef', {
        template: '<vesta-nav></vesta-nav>'
          + '<div id="nonNavContainer" class="sideNavOpen">'
          + '<become-chef></become-chef>'
          + '</div>',
        resolve: {
          // Becoming a chef requires a login
          auth: function ($q, authService) {
            return authService.getUser();
          }
        }
      })
      .when('/becomeAChef/stripeCallback', {
        template: '<p>become a chef callback</p>',
        controller: function($location, $http) {
          var stripeParams = $location.search();
          console.log(JSON.stringify(stripeParams));

          $http
            .put('/api/users/charlie', stripeParams)
            .then(function onSuccess(response) {
              console.log('success')
              console.log(response)
            }, function onError(response) {
              console.log('error')
              console.log(response)
            });
        }
      })
      .when('/splash', {
        template: '<splogin></splogin>'
      });
  },
]).run(["$rootScope", "$location", function ($rootScope, $location) {
  $rootScope.$on("$routeChangeSuccess", function (userInfo) {
    console.log(userInfo);
    console.log("Route Change Success for " + $location.url());
  });

  $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
    console.log("Route Change Error for " + $location.url());
    if (eventObj.sessioned === false) {
      $location.path("/splash");
    }
    if (eventObj.authenticated === false) {
      $location.path("/login");
    }
  });

}]).factory("authService", ["$location","$http","$q","$window",function ($location, $http, $q, $window) {
  // For now session and user are largely the same
  // TODO different them or put as one object
  // I think the best way would be to have the user info as a larger session object
  // session without user would be like an address or something
  //    Might grow to include search results, temporary carts, etc
  // user object is simply the user's _id, username, and fbID
  //    Should also have address though?
  var user;
  var session;

  function fblogin() {
    // I don't see this working another way due to cross origin scripting issues
    window.location = "/api/auth/facebook"
    console.log("ok");
  }

  function logout() {
      var deferred = $q.defer();

      $http({
          method: "POST",
          url: "/api/logout",
          headers: {
              "access_token": userInfo.accessToken
          }
      }).then(function (result) {
          userInfo = null;
          $window.sessionStorage["userInfo"] = null;
          deferred.resolve(result);
      }, function (error) {
          deferred.reject(error);
      });

      return deferred.promise;
  }

  function getSession() {
    if (session && session.id) {
      return session;
    }
    else {
      var deferred = $q.defer();

      $http.get("/api/auth/session").then(function (result) {
        if (result.data._id) {
          session = {
              id: result.data._id,
              userName: result.data.displayName,
              fbID: result.data.fbID
          };
          console.log(session);
          deferred.resolve(session);
          // TODO if we want to make our REST server stateless
          // $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
        }
        else {
          deferred.reject({sessioned: false});
        }
      }, function (error) {
        deferred.reject({sessioned: false});
      });

      return deferred.promise
    }
  }

  function getUser() {
    console.log(user);
    if (user && user.id) {
      return user;
    }
    else {
      var deferred = $q.defer();

      $http.get("/api/auth/user").then(function (result) {
        if (result.data._id) {
          user = {
              id: result.data._id,
              userName: result.data.displayName,
              fbID: result.data.fbID
          };
          deferred.resolve(user);
        }
        else {
          deferred.reject({authenticated: false});
        }
      }, function (error) {
        deferred.reject({authenticated: false});
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
      getUser: getUser
  };
}]);
