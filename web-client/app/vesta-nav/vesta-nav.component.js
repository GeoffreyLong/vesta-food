angular.module('vestaNav').component('vestaNav', {
  templateUrl: 'vesta-nav/vesta-nav.template.html',
  controller: function VestaNavController($scope, $mdSidenav, authService, $location, 
                                          $mdMenu, dataService, $mdDialog, $mdMedia) {
    this.session = authService.getSession();
    this.currentPath = $location.path();

    $scope.fblogin = function(){
      authService.fblogin();
    }
    $scope.logout = function(){
      authService.logout();
    }


    /********************* SIDE NAV *************************************/
    // TODO
    //  Accordian this shizz... either wait for Angular Material's accordian or
    //    http://brilliantbritz.com/2015/06/17/creating-your-own-angular-material-right-navigation-menu/
    //    http://blog.vizuri.com/creating-your-own-angular-material-navigation-menu
    
    // STORE NAME LISTENER
    $scope.storeNameChange = function() {
      console.log('StoreName: ' + this.search.storeName)
    }
    
    $scope.slider = {
      minValue: 4,
      maxValue: 15,
      options: {
        floor: 4,
        ceil: 15,
        step: 1
      }
    }; 
    // Refresh the slider so that it initializes properly
    this.refreshSlider = function() {
      setTimeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      }, 10);
    };
    this.refreshSlider();

    // TAG LISTENER
    $scope.tags = ['vegetarian', 'vegan', 'kosher', 'halal'];
    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(tag) {
      var idx = $scope.selection.indexOf(tag);

      if (idx > -1) {
        // If currently selected
        $scope.selection.splice(idx, 1);
      }
      else {
        // If newly selected
        $scope.selection.push(tag);
      }

      console.log('Tag selections: ' + $scope.selection);
    }


    /********************* CART STUFF *************************************/
    $scope.showCart = function(ev){
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: function DialogController(cartService, $scope, $mdDialog, 
                                              $location, dataService){
          $scope.cart = cartService.getCart();

          // TODO it would probably be super smart to add error handling to this
          // NOTE not the fastest to keep passing it back to the cartService
          //      I tried to finagle with updating with the onRemoving field to no avail
          //      I didn't try for too long so there might be a solution if one were inclined
          $scope.increaseQty = function(storeCartIdx, foodIdx){
            $scope.cart[storeCartIdx].foods[foodIdx].quantity ++;
            cartService.updateCart($scope.cart);
          }
          $scope.decreaseQty = function(storeCartIdx, foodIdx){
            if ($scope.cart[storeCartIdx].foods[foodIdx].quantity != 0) {
              $scope.cart[storeCartIdx].foods[foodIdx].quantity --;
              cartService.updateCart($scope.cart);
            }
          }
          $scope.removeFood = function(storeCartIdx, foodIdx){
            // Remove the item from the cart
            $scope.cart[storeCartIdx].foods.splice(foodIdx, 1);

            // If the storeCart is empty then remove that object
            if ($scope.cart[storeCartIdx].foods.length == 0) {
              // This will handle updating the cart in cartService and our scope
              $scope.removeOrder($scope.cart[storeCartIdx]);
            }
            else {
              // If the storeCart is not empty then we have to update the cart
              cartService.updateCart($scope.cart);
            }
          }

          // TODO would probably be good to refactor this so the changes are made locally
          //      then pushed to the cart service, like how they are in the other fns
          $scope.removeOrder = function(storeCart) {
            $scope.cart = cartService.removeStoreCart(storeCart);
          }

          $scope.purchaseOrder = function(storeCart) {
            dataService.setPurchaseOrder(storeCart);
            $mdDialog.hide();
            $location.path('/purchase');
          }

          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
        },
        templateUrl: 'vesta-nav/cart-dialog.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
      })
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

  }
});
