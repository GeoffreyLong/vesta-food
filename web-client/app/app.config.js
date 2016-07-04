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
      $locationProvider.hashPrefix('!');
      $routeProvider
        .when('/', {
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
        })
        .when('/purchase', {
          template: '<vesta-nav></vesta-nav>'
            + '<div id="nonNavContainer" class="sideNavOpen">'
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
          + '<div id="nonNavContainer" class="sideNavOpen">'
          + '<dashboard></dashboard>'
          + '</div>',
          resolve: {
            // Going to the stores view only requires a session
            auth: function ($q, authService) {
              return authService.getSession();
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
    }
  ]);
