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

    // To get this we will have to do a join on buyer and the storeId
    // TODO remove
    $scope.storeReviews = [{
      storeID: 123456789,
      buyer: {
        _id: 111111111,
        displayName: 'Dude Guy Kid',
        photo: '/images/chef_1_profile.jpg'
      },
      date: "TODO",
      overall: 4,
      comment: "This was pretty good. Not as good as the person claimed, but good enough"
    }, {
      storeID: 123456789,
      buyer: {
        _id: 123212321,
        displayName: 'Jameis No Namesly',
      },
      date: "TODO",
      overall: 5,
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
        + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." 
        + "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }, {
      storeID: 123456789,
      buyer: {
        _id: 121212121,
        displayName: 'Another One',
        photo: '/images/chef_5_profile.jpg'
      },
      date: "TODO",
      overall: 5,
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
        + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." 
        + "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }, {
      storeID: 123456789,
      buyer: {
        _id: 111111111,
        displayName: 'Dude Guy Kid',
        photo: '/images/chef_1_profile.jpg'
      },
      date: "TODO",
      overall: 4,
      comment: null
    }];

    $scope.slickConfig = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      touchMove: false,
      centerMode: true,
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
          // TODO either disable or remove the buttons (esp add to cart)
          //    from the non-focused elements
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

    $scope.addToCart = function(ev, food) {
      // NOTE here is where it gets tricky
      //      So someone could edit the food item after posting it
      //      But I guess the food's _id remains the same, which is cool
      //      I feel like this could be the cause of issues later on
      // NOTE I'm gonna go ahead and use localStorage for this
      //      Initially I planned on placing it inside the user session object
      //      I think it is better to not have to deal 
      //      with passing this info back and forth though
      var foodQty = cartService.addToCart($scope.store._id, food);
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
