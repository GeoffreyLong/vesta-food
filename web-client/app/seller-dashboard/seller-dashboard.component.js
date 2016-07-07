angular
  .module('sellerDashboard')
  .component('sellerDashboard', {
    templateUrl: 'seller-dashboard/seller-dashboard.template.html',
    controller: function SellerDashboardController($http, authService) {
      var self = this;
      var userId = authService.getSession().user._id;
      var url = "/api/users/" + userId + "/store/purchases";

      $http
        .get(url)
        .then(function successCallback(response) {
          console.log(response);
          self.purchases = response.data;
        }, function errorCallback(error) {
          console.log(error);
        });
    }
  });