angular.module('vestaNav').component('vestaNav', {
  templateUrl: 'vesta-nav/vesta-nav.template.html',
  controller: function VestaNavController($scope, $mdSidenav, authService, $location, 
                                          $mdMenu, dataService, $mdDialog, $mdMedia) {
    this.session = authService.getSession();
    this.currentPath = $location.path();

    // TODO issues when clicking escape... capture this too
    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();

      // TODO check if this is always valid
      // Also not sure if this is good practice in Angular
      $('#nonNavContainer').toggleClass('sideNavOpen');
    };

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
        controller: function DialogController(dataService, $scope, $mdDialog){

          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.answer = function(answer) {
            $mdDialog.hide(answer);
          };
        },
        templateUrl: 'vesta-nav/cartDialog.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
      .then(function(answer) {
        // NOTE might want to consider saving this here to the DB as a temp file
        console.log(answer);
      }, function() {
        // Error handling?
      });
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

  }
});
