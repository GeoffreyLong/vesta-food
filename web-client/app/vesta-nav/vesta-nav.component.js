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


    $scope.showStripeDialog = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: function DialogController($scope, CONFIG){
          $scope.stripeCallbackUri = CONFIG.STRIPE.CALLBACK_URI;

          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
        },
        templateUrl: 'vesta-nav/stripe-permission-dialog.template.html',
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

    /********************* CART STUFF *************************************/
    $scope.showCart = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: function DialogController(cartService, $scope, $mdDialog, 
                                              $location, dataService, $http, CONFIG){
          $scope.cart = cartService.getCart();

          $scope.routeToStore = function(storeId) {
            $mdDialog.hide();
            $location.path('/store/' + storeId);
          }

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
              $scope.removeOrder(storeCartIdx);
            }
            else {
              // If the storeCart is not empty then we have to update the cart
              cartService.updateCart($scope.cart);
            }
          }

          
          $scope.calculateTotal = function(storeCartIdx) {
            var total = 0;
            $scope.cart[storeCartIdx].foods.forEach(function(food) {
              total += food.quantity * food.price;
            });

            return total;
          }
  



          $scope.removeOrder = function(storeCartIdx) {
            $scope.cart.splice(storeCartIdx, 1);
            cartService.updateCart($scope.cart);
          }
          // NOTE might be nice to put the chef's image here instead of the logo 
          $scope.purchaseOrder = function(storeCartIdx) {
            var storeCart = $scope.cart[storeCartIdx];
            var handler = StripeCheckout.configure({
              key: CONFIG.STRIPE.PUBLIC_KEY,
              image: '/img/documentation/checkout/marketplace.png',
              token: function(token) {
                storeCart.token = token;
                if (token.error) {
                  window.alert('Payment failed! error: ' + result.error.message);
                } 
                else {
                  $scope.removeOrder(storeCartIdx);
                  console.log(storeCart);
                  var userId = authService.getSession().user._id;
                  var url = "/api/users/" + userId + "/purchases";
                  $http.post(url, {
                    data: storeCart
                  }).then(function success(response) {
                    $mdDialog.hide();
                    $location.path('/dashboard');
                  }, function error(response) {

                  })
                }
              }
            });
            handler.open({
              name: storeCart.storeTitle,
              description: "Make a purchase from " + storeCart.storeTitle,
              amount: $scope.calculateTotal(storeCartIdx) * 100
            });
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
