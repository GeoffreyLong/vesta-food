angular
  .module('purchase')
  .config(function () {
    Stripe.setPublishableKey('pk_test_LuReqVByWV1HR5HQTFjaEBSZ');
  })
  .component('purchase', {
    templateUrl: 'purchase/purchase.template.html',
    controller: function PurchaseController($scope, dataService, authService){
      // This has userId in it
      $scope.session = authService.getSession();
  
      $scope.storeCart = dataService.getPurchaseOrder();
      console.log($scope.storeCart);

      $scope.stripeCallback = function (code, result) {
        if (result.error) {
          window.alert('it failed! error: ' + result.error.message);
        } else {
          window.alert('success! token: ' + result.id);
        }
      };
    }
  });
