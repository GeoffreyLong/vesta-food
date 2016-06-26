angular.module('storeFront').component('storeFront', {
  templateUrl: 'store-front/store-front.template.html',
  controller: function StoreFrontController($scope, dataService, $location, $http){
    // TODO If for any reason we cannot get the store,
    //    like if this returns null, then we will use the :storeID on the url
    //    to get query the database for the store
    $scope.store = dataService.getStore();
    if (!$scope.store){
      $http.get('/api' + $location.path()).then(function(store) {
        $scope.store = store.data;
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
          if ($('.slick-slide').length <= 3) {
            $('.slick-slide').css({
              'transition': 'none',
              'transform': 'scale(1)'
            });
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
    $scope.checkOwnership = function() {
      return true;
    }
  }
});
