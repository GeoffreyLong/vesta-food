angular.module('vestaNav').component('vestaNav', {
  templateUrl: 'vesta-nav/vesta-nav.template.html',
  controller: function VestaNavController($scope, $mdSidenav) {
    this.user = {
      displayName: 'UserName'
    }

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };
  }
});
