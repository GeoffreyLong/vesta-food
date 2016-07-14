angular.module('storeFront').component('storeFront', {
  templateUrl: 'store-front/store-front.template.html',
  controller: function StoreFrontController($scope, dataService, authService, $mdToast,
                                            $location, $http, $mdBottomSheet, cartService){
    // TODO add in the dataService function for getting stores
    //      Something like dataService.getStore('storeId')
    //      This will also handle the db query below if it isn't found?
    //      $scope.store = dataService.getStore(storeId);
    if (!$scope.store){
      $http.get('/api' + $location.path()).then(function(store) {
        $scope.store = store.data;
        $scope.foodLoaded = true;
      }, function(err) {
        
      });;
    }


    $scope.slickConfig = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      touchMove: false,
      centerMode: true,
      focusOnSelect: true,
      method: {},
      event: {
        init: function (event, slick) {
          // slick.slickGoTo($scope.currentIndex); // slide to correct index when init
          
          // NOTE could consider the setPosition update in here instead

          // If there are three or fewer slick-slide elements then the slider won't init
          // Remove the css for expansions in this case
          // NOTE Might be better to do this template side 
          //      I could possibly do this with an ng-if so I don't load slick
          //      if it is not being used
          // TODO should probably center the elements... 
          if ($('.slick-slide').length <= 3) {
            $('.slick-slide').css({
              'transition': 'none',
              'transform': 'scale(1)'
            });
            $('md-card-actions').css({ 'display': 'flex' });
          }
        },
        beforeChange: function (event, slick, currentSlide, nextSlide) {
          // NOTE Not the best implementation, but it works
          //      could probably stop the animation
          if (currentSlide !== nextSlide) {
            $mdBottomSheet.hide();
          }
        },
        afterChange: function (event, slick, currentSlide, nextSlide) {
        }
      }
    };

    this.getNumber = function(num) {
      return new Array(num);   
    }    

    

    // TODO this will check the session to see if the user is the owner of the store
    // Interestingly enough, this fires multiple times since the scope reupdates
    //    Maybe we only want to fetch the session once
    $scope.checkOwnership = function() {
      var session = authService.getSession();
      return (session && session.user && $scope.store
              && (session.user.storeId == $scope.store._id)
              && (session.user._id == $scope.store.userId));
    }

    $scope.editStore = function() {
      // NOTE I think it would look cool to do this "in page" but for now we are routing
      //      To avoid template complexity
      //      We could do this in page either by ng-ifs with a flag
      //      Or by forcing the template heavy via JS I think
      //      That's a later problem though
      $location.path($location.path() + '/edit');
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
  }
});
