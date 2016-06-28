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
            return authService.getSession(true);
          }
        }
      })
      .when('/becomeAChef/stripeCallback', {
        template: '<p>become a chef callback TODO loading screen?</p>',
        controller: function($location, $http) {
          var stripeParams = $location.search();
          console.log(JSON.stringify(stripeParams));

          $http
            .post('/api/users/becomeChef', stripeParams)
            .then(function onSuccess(response) {
              console.log('success');
              console.log(response);
              $location.path('/store/:storeID/edit');
            }, function onError(response) {
              // TODO might want an error Page
              console.log('error');
              console.log(response);
              $location.path('/');
            });
        },
        resolve: {
          // Becoming a chef requires a login
          auth: function ($q, authService) {
            return authService.getSession(true);
          }
        }
      })
      .when('/splash', {
        template: '<splogin></splogin>'
      })
      .when('/store/:storeID', {
        template: '<vesta-nav></vesta-nav>'
          + '<div id="nonNavContainer" class="sideNavOpen">'
          + '<store-front></store-front>'
          + '</div>',
        resolve: {
          // Going to the stores view only requires a session
          auth: function ($q, authService) {
            return authService.getSession();
          }
        }
      })
      .when('/store/:storeID/edit', {
        template: '<vesta-nav></vesta-nav>'
          + '<div id="nonNavContainer" class="sideNavOpen">'
          + '<store-edit></store-edit>'
          + '</div>',
        resolve: {
          // Going to the stores view only requires a session
          auth: function ($q, authService) {
            return authService.requireStore();
          }
        }
      });
  },
]).run(["$rootScope", "$location", "$window", function ($rootScope, $location, $window) {
  $rootScope.$on("$routeChangeSuccess", function (userInfo) {
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
    if (eventObj.storeOwner === false) {
      $window.history.back(); 
    }
  });

}]).factory("authService", ["$location","$http","$q","$window",function ($location, $http, $q, $window) {
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
}])
.service('dataService', function() {
  // TODO could use this to manage the client side session storage
  // Take hints from cache algorithms like "least recently used" to push out stores
  // Should probably always keep the person's store cached

  this.storeData = null;
  this.editPhoto = null;

  this.setStore = function(store) {
    this.storeData = store;
  }
  this.getStore = function() {
    return this.storeData;
  }

  // To set and retreive photos for editing
  this.setEditPhoto = function(photo){
    this.editPhoto = photo;
  }
  this.getEditPhoto = function(){
    return this.editPhoto;
  }
})
.service('locationService', function() {
  this.getLocation = function() {
    // TODO should this be in a promise?
    // NOTE this might not even need to be a service

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
      }, function(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
        } 

        // TODO
        // In any error case have the user enter their address... possibly via a prompt
        // This may vary by what route it's called in though
        //    This is the best case for having it in a promise
        //    If this issue does arise

      });
    } 
    else {
        console.log("Geolocation is not supported by this browser.");
    }
  }
});
