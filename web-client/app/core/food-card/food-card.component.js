angular.module('foodCard').component('foodCard', {
  templateUrl: 'core/food-card/food-card.template.html',
  controller: function FoodCardController($scope, $location, $mdBottomSheet,
                                            cartService, $mdToast) {
    $scope.food = this.food;
    $scope.store = this.store;
    $scope.scopedPage = this.scopedPage;

    $scope.isEdit = function(){
      // Getting hacky with this
      // TODO fix up
      var re = new RegExp("\/store\/(.*)\/edit");
      var storeId = re.exec($location.path());    
    
      if (storeId) {
        return true;
      }
      return false;
    }

    // TODO might be nice to make the images clickable
    //      When the user is in the stores view a click should take you to the store
    //      with a focus on the specific food selected
    //      When the user is in edit, it should launch the edit dialog
    $scope.imageAction = function(){

    }

    $scope.showBottomSheet = function(ev, food){
      // TODO the parent isn't the best one 
      //      Perhaps it isn't resolving with the updated css for card
      //      This would look better if squares were forced
      //      Worry about styling then
      // TODO
      //      The clickOutsideToClose only happens in the local md-card
      //      Either dynamically style it to pop up in the card (solving earlier issue)
      //      or add a 'x' close button in it
      //      of add some sort of onblur function

      if ($('md-bottom-sheet').length == 0) {
        $mdBottomSheet.show({
          templateUrl: 'store-front/food-info-bsheet.template.html',
          parent: ev.currentTarget.closest('md-card'),
          clickOutsideToClose: true,
          disableParentScroll: false,
          locals: {food: food}, 
          controller: function BottomSheetController($scope, locals){
            $scope.food = locals.food;
          }
        }).then(function(clickedItem) {
          // $scope.alert = clickedItem['name'] + ' clicked!';
        });
      }
      else {
        $mdBottomSheet.hide();
      }
    }

    $scope.addToCart = function(ev, food) {
      // NOTE here is where it gets tricky
      //      So someone could edit the food item after posting it
      //      But I guess the food's _id remains the same, which is cool
      //      I feel like this could be the cause of issues later on
      // NOTE I'm gonna go ahead and use localStorage for this
      //      Initially I planned on placing it inside the user session object
      //      I think it is better to not have to deal 
      //      with passing this info back and forth though
      var foodQty = cartService.addToCart($scope.store._id, $scope.store.storeTitle, food);
      $mdToast.show(
        $mdToast.simple()
          .textContent(foodQty + ' of item added to cart')
          .position('bottom left right')
          .hideDelay(3000)
          .parent(ev.srcElement.closest('md-card'))
      );
    }

    this.goToStore = function(storeId, itemIndex) {
      console.log("Store is: " + storeId);
      
      if (itemIndex >= 0) {
        $location.path('/store/' + storeId + '#' + itemIndex);
      }
      else {
        $location.path('/store/' + storeId);
      }
    }

  },
  bindings: {
    food: '=',
    store: '=',
    scopedPage: '@'
  }
});
