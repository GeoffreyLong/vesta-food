angular.module(vestaApp).config(['$mdThemingProvider',
  function($mdThemingProvider) {
    // This provides some styling
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('blue-grey')
    .warnPalette('orange');
  }
]);
