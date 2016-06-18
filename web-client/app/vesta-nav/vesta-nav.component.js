angular.module('vestaNav').component('vestaNav', {
  templateUrl: 'vesta-nav/vesta-nav.template.html',
  controller: function VestaNavController($scope, $mdSidenav) {
    this.user = {
      displayName: 'UserName'
    };

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();

      // TODO check if this is always valid
      // Also not sure if this is good practice in Angular
      $('#nonNavContainer').toggleClass('sideNavOpen');
      for (var i = 0; i < 5; i ++){
        setTimeout(function(){
            $('slick').slick('setPosition', 0)
        }, i*100);
      }
    };
  }
});
