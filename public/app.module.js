angular.module('vestaApp', [
    'vestaNav',
    'sideNav',
    'storesView',
    'ngMaterial'
]).config(function($mdThemingProvider) {
  // This provides some styling
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('blue-grey')
    .warnPalette('orange');
});
