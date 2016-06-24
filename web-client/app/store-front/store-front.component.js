angular.module('storeFront').component('storeFront', {
  templateUrl: 'store-front/store-front.template.html',
  controller: function StoreFrontController($scope, dataService){
    // TODO If for any reason we cannot get the store,
    //    like if this returns null, then we will use the :storeID on the url
    //    to get query the database for the store
    $scope.store = dataService.getStore();
    if (!$scope.store){
      // Temporary store population if could not get it
      // TODO have a DB query instead later
      $scope.store = {
        userID: "123456789",
        storeID: "123456789",
        storeTitle: "Geoff's Store 1",
        profilePhoto: "/images/chef_1_profile.jpg",
        pickupAddress: "3515 Rue Durocher",
        neighborhood: "TODO",
        stripeAuth: "TODO",
        description: "This is the best store you'll ever go to. I make lots of things.",
        availability: "TODO",
        overallRating: 4,
        foods: [{
          name: "Hamburger Pastry thingies",
          photo: "/images/chef_1-1.png",
          price: 10,
          shelfLife: 3,
          prepTime: 2,
          overallRating: 5
        }, {
          name: "Schwarma Guy Wraps",
          photo: "/images/chef_1-2.jpg",
          price: 8,
          shelfLife: 2,
          prepTime: 4,
          overallRating: 3
        }, {
          name: "Schwarma Guy Wraps",
          photo: "/images/chef_1-2.jpg",
          price: 8,
          shelfLife: 2,
          prepTime: 4,
          overallRating: 3
        }, {
          name: "Schwarma Guy Wraps",
          photo: "/images/chef_1-2.jpg",
          price: 8,
          shelfLife: 2,
          prepTime: 4,
          overallRating: 3
        }, {
          name: "Salmon Delight",
          photo: "/images/chef_1-3.jpeg",
          price: 8,
          shelfLife: 1,
          prepTime: 1,
          overallRating: 2
        }]
      };
    }

    // To get this we will have to do a join on buyer and the storeId
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
  }
});
