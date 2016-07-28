angular.module('vestaNav').component('vestaNav', {
  templateUrl: 'vesta-nav/vesta-nav.template.html',
  controller: function VestaNavController($scope, $mdSidenav, authService, $location, 
                                          $mdMenu, dataService, $mdDialog, $mdMedia) {
    authService.getSession().then(function(session){
      $scope.session = session;
      console.log(session);
    }, function(err) {

    });


    $scope.currentPath = $location.path();

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

          $scope.routeToEvent = function(eventId) {
            $mdDialog.hide();
            $location.path('/event/' + eventId);
          }

          // TODO it would probably be super smart to add error handling to this
          // NOTE not the fastest to keep passing it back to the cartService
          //      I tried to finagle with updating with the onRemoving field to no avail
          //      I didn't try for too long so there might be a solution if one were inclined
          $scope.increaseQty = function(subCartIdx, foodIdx){
            $scope.cart[subCartIdx].foods[foodIdx].quantity ++;
            cartService.updateCart($scope.cart);
          }
          $scope.decreaseQty = function(subCartIdx, foodIdx){
            if ($scope.cart[subCartIdx].foods[foodIdx].quantity != 0) {
              $scope.cart[subCartIdx].foods[foodIdx].quantity --;
              cartService.updateCart($scope.cart);
            }
          }
          $scope.removeFood = function(subCartIdx, foodIdx){
            // Remove the item from the cart
            $scope.cart[subCartIdx].foods.splice(foodIdx, 1);

            // If the subCart is empty then remove that object
            if ($scope.cart[subCartIdx].foods.length == 0) {
              // This will handle updating the cart in cartService and our scope
              $scope.removeOrder(subCartIdx);
            }
            else {
              // If the subCart is not empty then we have to update the cart
              cartService.updateCart($scope.cart);
            }
          }

          
          $scope.calculateTotal = function(subCartIdx) {
            var total = 0;
            $scope.cart[subCartIdx].foods.forEach(function(food) {
              total += food.quantity * food.price;
            });

            return total;
          }
  



          $scope.removeOrder = function(subCartIdx) {
            $scope.cart.splice(subCartIdx, 1);
            cartService.updateCart($scope.cart);
          }

          // NOTE might be nice to put the chef's image here instead of the logo 
          $scope.purchaseOrder = function(subCartIdx) {
            var subCart = $scope.cart[subCartIdx];
            var handler = StripeCheckout.configure({
              key: CONFIG.STRIPE.PUBLIC_KEY,
              image: '/images/vesta/vesta_logo_greenbg.png',
              token: function(token) {
                subCart.token = token;
                if (token.error) {
                  window.alert('Payment failed! error: ' + result.error.message);
                } 
                else {
                  $scope.removeOrder(subCartIdx);
                  console.log(subCart);
                  var userId = authService.getSessionSynch().user._id;
                  var url = "/api/users/" + userId + "/purchases";
                  $http.post(url, {
                    data: subCart
                  }).then(function success(response) {
                    $mdDialog.hide();
                    $location.path('/dashboard');
                  }, function error(response) {

                  })
                }
              }
            });
            handler.open({
              name: subCart.eventName,
              description: "Make a purchase from " + subCart.hostName,
              amount: $scope.calculateTotal(subCartIdx) * 100
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
