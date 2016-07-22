// TODO
//    
//    Might want to consider delaying the page render until the slick is slicked
//    Might want to consider lazy loading after a certain number

angular.module('storesView').component('storesView', {
  templateUrl: 'stores-view/stores-view.template.html',
  controller: function StoresViewController(dataService, $location, $scope, $http) {
    // Get all the stores in a given location
    // NOTE might want to cache this at a later date for speed
    //    Could cache it with the address to check for address changes
    //    Also with a timestamp or at least have it expire
    //    There might be a good way to do this
    $http({
      method: 'GET',
      url: 'api/foods?current=true'
    }).then(function(data) {
      // This gives the number of rows
      // Three looks good on my screen
      // Might want to make it dynamic based on screen size
      console.log(data);
      $scope.currentStores = chunk(data.data);
      console.log($scope.currentStores);
    }, function(err) {
      console.log(err);
    });

    // Get the past stores from a given location
    $http({
      method: 'GET',
      url: 'api/foods?current=false'
    }).then(function(data) {
      // This gives the number of rows
      // Three looks good on my screen
      // Might want to make it dynamic based on screen size
      console.log(data);
      $scope.previousStores = chunk(data.data);
    }, function(err) {
      console.log(err);
    });

    // This will only fire once
    // I could probably move the $scope.currentStores and $scope.previousStores
    // to another location, but I don't think we need to be too dynamic, 
    // As long as it sets correctly the first time.
    function chunk(arr) {
      var size = 2;
      console.log(window.innerWidth);
      if (window.innerWidth > 1500) {
        size = 3;
      }

      var newArr = [];
      for (var i = 0; i < size; i ++) {
        var tempArr = [];
        for (var j = i; j < arr.length; j += size) {
          tempArr.push(arr[j]);
        }
        newArr.push(tempArr);
      }
      return newArr;
    }


    this.getNumber = function(num) {
      return new Array(num);   
    }

    // Hopefully this solves the image loading bug on first visit
    // If not try wrapping this in an image loading event
    //    so it fires after the images have been sent
    // This will also hide the elements until they are ready to be rendered
    $('#storesContainer').hide();
    var refreshSlick = setInterval(function() {
      if ($('.slider').length > 0) {
        // HACK to avoid slick styling bugs when one column
        // Still a minor flicker which might be avoidable 
        // through a setTimeout on the next lines
        $(window).resize();
        
        $('#storesContainer').show();
        clearInterval(refreshSlick);
        $('.slider').slick('setPosition');
      }
    }, 500);

    // If itemIndex is set to one of the photos, then one of the foods was clicked
    // In this case go to the storefront with some sort of emphasis on the food item
    this.goToStore = function(store, itemIndex) {
      dataService.setStore(store);
      console.log("Store is: " + store);
      
      if (itemIndex >= 0) {
        $location.path('/store/' + store._id + '#' + itemIndex);
      }
      else {
        $location.path('/store/' + store._id);
      }
    }
  }
});
