angular.module('profileEdit').component('profileEdit', {
  templateUrl: 'profile-edit/profile-edit.template.html',
  controller: function ProfileEditController($scope, $location, $http){
    // NOTE might not be the best way to handle the path...
    //      This is the same way as is done in app.config.js
    var re = new RegExp("\/user\/(.*)\/edit");
    var userId = re.exec($location.path())[1];    

    $http.get('/api/users/' + userId).then(function(user) {
      $scope.user = user.data;

      console.log($scope.user);
      // Needed to pass to dialog
      dataService.setUser($scope.user);
      $scope.clonedUser = dataService.getClonedUser();
    }, function(err) {
      // TODO error handling
    });
    

  }
});
