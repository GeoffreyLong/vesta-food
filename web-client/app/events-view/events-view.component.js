// TODO
//    
//    Might want to consider delaying the page render until the slick is slicked
//    Might want to consider lazy loading after a certain number

angular.module('eventsView').component('eventsView', {
  templateUrl: 'events-view/events-view.template.html',
  controller: function StoresViewController(dataService, $location, $scope, $http) {
    // Get all the stores in a given location
    // NOTE might want to cache this at a later date for speed
    //    Could cache it with the address to check for address changes
    //    Also with a timestamp or at least have it expire
    //    There might be a good way to do this
    $http({
      method: 'GET',
      url: 'api/events?current=true'
    }).then(function(data) {
      // This gives the number of rows
      // Three looks good on my screen
      // Might want to make it dynamic based on screen size
      $scope.current = chunk(data.data);
    }, function(err) {
      console.log(err);
    });

    // Get the past stores from a given location
    $http({
      method: 'GET',
      url: 'api/events?current=false'
    }).then(function(data) {
      // This gives the number of rows
      // Three looks good on my screen
      // Might want to make it dynamic based on screen size
      $scope.previous = chunk(data.data);
    }, function(err) {
      console.log(err);
    });

    // This will only fire once
    // I could probably move the $scope.currentStores and $scope.previousStores
    // to another location, but I don't think we need to be too dynamic, 
    // As long as it sets correctly the first time.
    function chunk(arr) {
      var size = 2;
      if (window.innerWidth > 1500) {
        size = 3;
      }

      var newArr = [];
      for (var i = 0; i < size; i ++) {
        var tempArr = [];
        for (var j = i; j < arr.length; j += size) {
          tempArr.push(arr[j]);
        }
        if (tempArr.length !== 0) {
          newArr.push(tempArr);
        }
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
    $('#viewContainer').hide();
    var refreshSlick = setInterval(function() {
      if ($('.slider').length > 0) {
        // HACK to avoid slick styling bugs when one column
        // Still a minor flicker which might be avoidable 
        // through a setTimeout on the next lines
        $(window).resize();
        
        $('#viewContainer').show();
        clearInterval(refreshSlick);
        $('.slider').slick('setPosition');
      }
    }, 500);

    $scope.goTo = function(loc) {
      $location.path(loc);
    }
  }
});