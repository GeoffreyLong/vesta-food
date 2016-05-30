angular.module('sideNav').component('sideNav', {
  templateUrl: 'side-nav/side-nav.template.html',
  controller: function SideNavController($scope, $mdSidenav) {
    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };
  }
});
