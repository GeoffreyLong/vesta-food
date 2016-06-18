angular.module('vestaNav').component('vestaNav', {
  templateUrl: 'vesta-nav/vesta-nav.template.html',
  controller: function VestaNavController($scope, $mdSidenav, authService) {
    this.session = authService.getSession();

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();

      // TODO check if this is always valid
      // Also not sure if this is good practice in Angular
      $('#nonNavContainer').toggleClass('sideNavOpen');
    };
  }
});
