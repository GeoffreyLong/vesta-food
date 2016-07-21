angular.module('storeFront').component('storeFront', {
  templateUrl: 'store-front/store-front.template.html',
  controller: function StoreFrontController($scope, dataService, authService, $mdToast,
                                            $location, $http, $window, $mdBottomSheet){
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
          $scope.slickStyle();
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

    angular.element($window).bind('resize', function(){
      $scope.slickStyle();

      // manuall $digest required as resize event
      // is outside of angular
      $scope.$digest();
    });

    $scope.slickStyle = function() {
      if ($scope.foodLoaded && $scope.store.foods.length <= 3) {
        if ($('.slick-slide').length <= 3) {
          $('.slick-slide').css({
            'transition': 'none',
            'transform': 'scale(1)',
          });
          $('.slick-track').css({'margin': 'auto'});
          $('md-card-actions').css({ 'display': 'flex' });
        }
        console.log($(window).width());


        // Specific styling for fewer than three cards
        if ($(window).width() > 1300) {
          $scope.slickConfig.slidesToShow= 3;
        }
        else if ($(window).width() < 1300 && $(window).width() > 700) {
          $scope.slickConfig.slidesToShow= 2;
        }
        else {
          $scope.slickConfig.slidesToShow= 1;
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
      var session = authService.getSessionSynch();
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

  }
});
