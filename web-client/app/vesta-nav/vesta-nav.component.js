angular.module('vestaNav').component('vestaNav', {
  templateUrl: 'vesta-nav/vesta-nav.template.html',
  controller: function VestaNavController($scope, $mdSidenav, authService, $location, $mdPanel, mdPanelRef) {
    this.session = authService.getSession();
    this.currentPath = $location.path();

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

    $scope.openMenu = function(ev){
      var position = $mdPanel.newPanelPosition()
          .relativeTo('.menuOpenButton')
          .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);
      var config = {
        attachTo: angular.element(document.body),
        controller: function() {},
        controllerAs: 'ctrl',
        template: '<md-menu-content>'
      + '<md-menu-item class="md-indent"><md-icon class="material-icons"> person </md-icon><md-button ng-click="logout()">Logout</md-button></md-menu-item>'
      +  '<md-menu-divider></md-menu-divider><md-menu-item class="md-indent"><md-button ng-click="">Unrelated actions</md-button></md-menu-item>'
      + '</md-menu-content>',
        panelClass: 'demo-menu-example',
        position: position,
        openFrom: ev,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true,
        zIndex: 12
      };
      $mdPanel.open(config);
    };

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


  }
});
