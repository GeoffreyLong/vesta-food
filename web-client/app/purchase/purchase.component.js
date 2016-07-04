angular
  .module('purchase')
  .config(function () {
    Stripe.setPublishableKey('pk_test_LuReqVByWV1HR5HQTFjaEBSZ');
  })
  .component('purchase', {
    templateUrl: 'purchase/purchase.template.html',
    controller: function PurchaseController($scope, $http, $location, dataService, authService){
      // This has userId in it
      $scope.session = authService.getSession();
      $scope.storeCart = dataService.getPurchaseOrder();

      $scope.stripeCallback = function (code, result) {
        if (result.error) {
          window.alert('it failed! error: ' + result.error.message);
        } else {
          var userId = authService.getSession().user._id;
          var url = "/api/users/" + userId + "/purchases";
          $http.post(url, {
            storeId: $scope.storeCart.storeId,
            foods: $scope.storeCart.foods,
            stripePaymentToken: result.id
          }).then(function success(response) {
            $location.path('/dashboard');
          }, function error(response) {

          })
        }
      };
    }
  });
