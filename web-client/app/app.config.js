// TODO (I guess I will put app wide TODOs here)
//      Might want to separate the images that are user generated 
//      from those that are for the website (logos, default profiles, etc) in the directories. 
//      Could consider putting the app ones on client and user on server
//      This would certainly avoid the current madness of referencing 
//      web-client from the server to save images

angular
  .module('vestaApp')
  .config(['$mdThemingProvider', '$locationProvider', '$routeProvider', '$httpProvider',
    function config($mdThemingProvider, $locationProvider, $routeProvider, $httpProvider) {
      // Prevent "No 'Access-Control-Allow-Origin' header is present" errors
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];

      // This provides some styling
      $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('blue-grey')
        .warnPalette('orange');

      // TODO decide if this is something we want
      $locationProvider.html5Mode(true).hashPrefix('!');
      $routeProvider
        .when('/splash', {
          template: '<splogin></splogin>'
        })
        .when('/', {
          template: '<vesta-nav></vesta-nav>'
            + '<div id="nonNavContainer">'
            + '<stores-view></stores-view>'
            + '</div>',
          resolve: {
            // Going to the stores view only requires a session
            auth: function ($q, authService) {
              return authService.getSession();
            }
          }
        })
        .when('/user/:id', {
          template: '<vesta-nav></vesta-nav>'
            + '<div id="nonNavContainer">'
            + '<profile></profile>'
            + '</div>',
          resolve: {
            // Going to the stores view only requires a session
            auth: function ($q, authService) {
              return authService.getSession();
            }
          }
        })
        .when('/user/:id/edit', {
          template: '<vesta-nav></vesta-nav>'
            + '<div id="nonNavContainer">'
            + '<profile-edit></profile-edit>'
            + '</div>',
          resolve: {
            // Going to the stores view only requires a session
            auth: function ($q, authService) {
              return authService.profileEditAuth();
            }
          }
        })
        .when('/becomeAChef', {
          template: '<vesta-nav></vesta-nav>'
            + '<div id="nonNavContainer">'
            + '<become-chef></become-chef>'
            + '</div>',
          resolve: {
            // Becoming a chef requires a login
            auth: function ($q, authService) {
              return authService.getUserSession();
            }
          }
        })
        .when('/becomeAChef/stripeCallback', {
          template: '<vesta-nav></vesta-nav>' + 
                    //'<div layout="row" layout-align="space-around"' +
                    //      'style="margin-top:50%; height:100%">' +
                    '<div style="position: fixed; top:45%; left:45%">' + 
                      '<md-progress-circular md-mode="indeterminate" md-diameter="100">' + 
                      '</md-progress-circular>' +
                    '</div>',
          controller: function($location, $http, authService) {
            var stripeParams = $location.search();

            var userId = authService.getSessionSynch().user._id;
            var url = '/api/users/' + userId + '/store';
            $http
              .post(url, stripeParams)
              .then(function onSuccess(response) {
                console.log('success');
                console.log(response);

                // Save the storeId in the 

                // NOTE could also put this store into the dataService to save a call
                //      Else, the edit page will reload an object we just had
                $location.path('/store/' + response.data._id + '/edit');
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
              return authService.getUserSession();
            }
          }
        })
        .when('/store/:storeID', {
          template: '<vesta-nav></vesta-nav>'
            + '<div id="nonNavContainer">'
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
            + '<div id="nonNavContainer">'
            + '<store-edit></store-edit>'
            + '</div>',
          resolve: {
            // Going to the stores view only requires a session
            auth: function ($q, authService) {
              return authService.storeEditAuth();
            }
          }
        })
        .when('/purchase', {
          template: '<vesta-nav></vesta-nav>'
            + '<div id="nonNavContainer">'
            + '<purchase></purchase>'
            + '</div>',
          resolve: {
            // Going to the stores view only requires a session
            auth: function ($q, authService) {
              return authService.getSession();
            }
          }
        })
        .when('/dashboard', {
          template: '<vesta-nav></vesta-nav>'
          + '<div id="nonNavContainer">'
          + '<buyer-dashboard></buyer-dashboard>'
          + '</div>',
          resolve: {
            auth: function ($q, authService) {
              return authService.getUserSession();
            }
          }
        })
        .when('/sellerDashboard', {
          template: '<vesta-nav></vesta-nav>'
          + '<div id="nonNavContainer">'
          + '<seller-dashboard></seller-dashboard>'
          + '</div>',
          resolve: {
            auth: function ($q, authService) {
              return authService.getStoreSession();
            }
          }
        })
        .otherwise({
          redirectTo: '/'
        });
    },
  ])
  .run(["$rootScope", "$location", "$window",
    function ($rootScope, $location, $window) {
      $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        console.log("Route Change Success for " + $location.url());
      });

      $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        console.log("Route Change Error for " + $location.url());
        console.log("Error = " + eventObj.sessioned);
        if (eventObj.sessioned === false) {
          $location.path("/splash");
        }
        if (eventObj.authenticated === false) {
          $location.path("/login");
        }
        // Might cause issues if errored on stripe callback to store edit transition
        if (eventObj.storeOwner === false) {
          $window.history.back();
        }
        if (eventObj.profileOwner === false) {
          $window.history.back();
        }
        if (eventObj.store === false) {
          $location.path("/");
        }
      });
    }
  ]);
