angular
  .module('vestaApp')
  .config(['$mdThemingProvider', '$locationProvider', '$routeProvider',
    function config($mdThemingProvider, $locationProvider, $routeProvider) {
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
            + '</div>'
          /*resolve: {
            auth: function ($q, authService) {
              var session = authService.getSession();
              if (session) {
                
              }
            }
          }*/
        })
        .when('/becomeAChef', {
          template: '<vesta-nav></vesta-nav>'
            + '<div id="nonNavContainer" class="sideNavOpen">'
            + '<become-chef></become-chef>'
            + '</div>'
          /*resolve: {
            auth: function ($q, authService) {
              var session = authService.getSession();
              if (session) {
                
              }
            }
          }*/
        });
    },
]);
