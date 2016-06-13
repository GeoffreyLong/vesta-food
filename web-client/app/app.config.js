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
            var session = authService.getSession();
            if (session) {
              return $q.when(session);
            }
            else {
              return $q.reject({sessioned: false});
            }
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
            var user = authService.getUser();
            if (user) {
              return $q.when(user);
            }
            else {
              return $q.reject({authenticated: false});
            }
          }
        }
      })
      .when('/splash', {
        template: '<splogin></splogin>'
      });
  },
]).run(["$rootScope", "$location", function ($rootScope, $location) {
  $rootScope.$on("$routeChangeSuccess", function (userInfo) {
    console.log("Route Change Success for " + $location.url());
    console.log(userInfo);
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

}]).factory("authService", ["$http","$q","$window",function ($http, $q, $window) {
  var user;
  var session;

  function fblogin() {
    var deferred = $q.defer();

    $http.get("/api/facebook")
      .then(function (result) {
        console.log(result);
        userInfo = {
            accessToken: result.data.access_token,
            userName: result.data.userName
        };
        // $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
        // deferred.resolve(userInfo);
      }, function (error) {
        // deferred.reject(error);
      });

    return deferred.promise;
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
      return session;
  }

  function getUser() {
      return user;
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
