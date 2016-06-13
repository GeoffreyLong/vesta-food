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
          template: '<stores-view></stores-view>'
        })
        
        .when('/becomeAChef', {
          template: '<become-chef></become-chef>'
        });
    },
]);
