angular.module('profile').component('profile', {
  templateUrl: 'profile/profile.template.html',
  controller: function ProfileController($scope, $http, $location, authService) {
    var re = new RegExp("\/user\/(.*)");
    var userId = re.exec($location.path())[1];        
    if (!$scope.user){
      $http.get('/api/users/' + userId).then(function(user) {
        $scope.user = user.data;
        console.log($scope.user);
      }, function(err) {
        
      });
    }    

    $scope.checkOwnership = function() {
      var session = authService.getSessionSynch();
      return (session && session.user && $scope.user
              && (session.user._id === $scope.user._id));
    }    

    $scope.editUser = function() {
      $location.path('/user/' + userId + '/edit');
    }
  }
});
