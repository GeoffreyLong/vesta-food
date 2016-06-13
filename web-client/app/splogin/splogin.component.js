angular.module('splogin').component('splogin', {
  templateUrl: 'splogin/splogin.template.html',
  controller: function SploginController($scope, authService) {
    $scope.fblogin = function(){
      authService.fblogin();
    }
  }
});
