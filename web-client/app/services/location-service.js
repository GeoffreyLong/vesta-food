angular
  .module('locationService', [])
  .service('locationService', function() {
    this.getLocation = function() {
      // TODO should this be in a promise?
      // NOTE this might not even need to be a service

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          console.log(position);
        }, function(error) {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              console.log("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.log("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              console.log("An unknown error occurred.");
              break;
          }

          // TODO
          // In any error case have the user enter their address... possibly via a prompt
          // This may vary by what route it's called in though
          //    This is the best case for having it in a promise
          //    If this issue does arise

        });
      }
      else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
  });