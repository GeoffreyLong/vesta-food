angular.module('purchase').component('purchase', {
  templateUrl: 'purchase/purchase.template.html',
  controller: function PurchaseController($scope, dataService, authService){
    // This has userId in it
    $scope.session = authService.getSession();

    $scope.storeCart = dataService.getPurchaseOrder();
    console.log($scope.storeCart);
  }
});
