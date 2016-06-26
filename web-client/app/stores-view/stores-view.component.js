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
      url: 'api/stores'
    }).then(function(data) {
      // This gives the number of rows
      // Three looks good on my screen
      // Might want to make it dynamic based on screen size
      $scope.chunkedData = chunk(data.data, 3);
    }, function(err) {
      console.log(err);
    });

    function chunk(arr, size) {
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
    var refreshSlick = setInterval(function() {
      if ($('.slider').length > 0) {
        clearInterval(refreshSlick);
        $('.slider').slick('setPosition');
      }
    }, 1000);

    // If itemIndex is set to one of the photos, then one of the foods was clicked
    // In this case go to the storefront with some sort of emphasis on the food item
    this.goToStore = function(store, itemIndex) {
      dataService.setStore(store);
      console.log(dataService.getStore());
      
      if (itemIndex >= 0) {
        $location.path('/store/' + store.storeID + '#' + itemIndex);
      }
      else {
        $location.path('/store/' + store.storeID);
      }
    }
  }
});
