angular
  .module('buyerDashboard')
  .component('buyerDashboard', {
    templateUrl: 'buyer-dashboard/buyer-dashboard.template.html',
    controller: function BuyerDashboardController($scope, $http, authService) {
      console.log('buyer dashboard controller');
      console.log(authService.getSession().user);
      var self = this;

      var userId = authService.getSessionSynch().user._id;
      var url = "/api/users/" + userId + "/purchases";
      $http
        .get(url)
        .then(function successCallback(response) {
          self.purchases = response.data;
        }, function errorCallback(error) {
          console.log('error');
        });
    }
  });
