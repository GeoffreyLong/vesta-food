angular.module('splogin').component('splogin', {
  templateUrl: 'splogin/splogin.template.html',
  controller: function SploginController($scope, authService, $http, $location, NgMap) {
    $scope.fblogin = function(){
      authService.fblogin();
    }

    $scope.placeChanged = function() {

    }

    $scope.addressSearch = function(address) {
      console.log(address);      

      // http://maps.google.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false

      $http.post("/api/locationSearch", address).then(function(response) {
        console.log("Response is: " + response);
        if (response) {
          $location.path('/');
        }
        else {
          // TODO
        }
      }, function(err) {
        console.log("ERROR: " + err); 
      });
    }
  }
});
