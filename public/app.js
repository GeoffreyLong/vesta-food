// Define the `phonecatApp` module
var vestaApp = angular.module('vestaApp', []);

// Define the `StoreListController` controller on the `vestaApp` module
vestaApp.controller('StoreListController', function StoreListController($scope) {
  $scope.stores = [
    {
      name: 'Nexus S',
      snippet: 'Fast just got faster with Nexus S.'
    }, {
      name: 'Motorola XOOM™ with Wi-Fi',
      snippet: 'The Next, Next Generation tablet.'
    }, {
      name: 'MOTOROLA XOOM™',
      snippet: 'The Next, Next Generation tablet.'
    }
  ];
});
