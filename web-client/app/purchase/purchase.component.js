angular.module('purchase').component('purchase', {
  templateUrl: 'purchase/purchase.template.html',
  controller: function PurchaseController($scope, dataService){
    $scope.storeCart = dataService.getPurchaseOrder();
    console.log($scope.storeCart);
  }
});
