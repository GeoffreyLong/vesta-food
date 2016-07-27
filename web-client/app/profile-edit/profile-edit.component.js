angular.module('profileEdit').component('profileEdit', {
  templateUrl: 'profile-edit/profile-edit.template.html',
  controller: function ProfileEditController($scope, $location, $http, dataService,
                                              NgMap, $mdMedia, $mdDialog, Upload){
    // NOTE might not be the best way to handle the path...
    //      This is the same way as is done in app.config.js
    var re = new RegExp("\/user\/(.*)\/edit");
    var userId = re.exec($location.path())[1];    

    $http.get('/api/users/' + userId).then(function(user) {
      $scope.user = user.data;

      console.log($scope.user);
      // Needed to pass to dialog
      dataService.setUser($scope.user);
      $scope.clonedUser = dataService.getClonedUser();
    }, function(err) {
      // TODO error handling
    });
    
    $scope.checkEquality = function(){
      // If either is undefined then just say they are equal 
      // This will avoid the initial flash at the beginning
      if (!$scope.user || !$scope.clonedUser) return true;
      return (JSON.stringify($scope.user) === JSON.stringify($scope.clonedUser));
    }

    // Callback to set the map after map initializes
    NgMap.getMap().then(function(map) {
      $scope.map = map;
    });
    $scope.placeChanged = function() {
      // console.log(this.getPlace());
      var place = this.getPlace();
      if (place.geometry) {
        var coords = place.geometry.location;
        $scope.user.address.lat = coords.lat();
        $scope.user.address.lng = coords.lng();
      }
    }







    /*************************** PHOTO EDITING *******************************/
    // TODO encapsulate
    $scope.showConfirm = function(ev, photo) {
      // So we can retreive the photo in the new scope
      dataService.setEditPhoto(photo);

      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: function DialogController(dataService, $scope, $mdDialog, locals){
          var photo = dataService.getEditPhoto();
          $scope.myImage = photo;
          $scope.myCroppedImage='';

          $scope.handleFileSelect = function(files) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
              $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
              });
            };
            reader.readAsDataURL(file);
          };

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
        templateUrl: 'profile-edit/imageCropDialog.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals: { photoNum: $scope.photoNum }
      })
      .then(function(answer) {
        // NOTE might want to consider saving this here to the DB as a temp file
        if (answer) {
          $scope.saveTempImage(answer);
        }
      }, function() {
        // Error handling?
      });
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.saveTempImage = function(tmpImage) {
      // Send the photo to the backend, 
      // get the callback, save the photo as the callback

      // Intermediate save so the website looks responsive 
      // Update the photo for the view
      // NOTE This if else is repeated, should condense logic
      $scope.user.profilePhoto = tmpImage;

      var image = $scope.blobConversion(tmpImage);

      var photoData = {
        image: image,
      };
      var fd = new FormData();
      fd.append('file', photoData);

      // Can add progress which is kindof cool 
      //    .progress(function(evt) { parseInt(100.0 * evt.loaded / evt.total); });
      Upload.upload({
        url: '/api/edit/photo',
        headers : {
            'Content-Type': 'multipart/form-data'
        },
        arrayKey: '',
        data: photoData
      }).then(function(data, status, headers, config){
        if (data.status == 200) {
          $scope.user.profilePhoto = data.data;
        }
        else {
          //TODO error handling
        }
      });

    };

    $scope.blobConversion = function(image) {
      // Convert to a format useable with ng-file-upload 
      var binary = atob(image.split(',')[1]);
      var mimeString = image.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    }



    /*************************** SAVE FUNCTIONS *******************************/
    $scope.resetChanges = function() {
      $scope.store = dataService.getClonedStore();
    }
    


    $scope.saveChanges = function() {
      // Send everything to the backend
      // Photos are moved from /tmp to the regular img directory

      // Validate the forms and the photos 
      // If valid then send the updated / new store to the servers
      if (checkForms() && checkPhotos()){
        console.log($scope.user);
        var userData = $scope.user;
        $http.post('api/users/' + userData._id, {
          data: userData
        }).then(function(data) {
          var re = new RegExp("\/user\/(.*)\/edit");
          var storeId = re.exec($location.path())[1];    
          $location.path("/user/" + userId);
        }, function(err) {
          // TODO error handling
          console.log(err);
        });
      }

    }


    var checkForms = function() {
      // Check to see if the error objects are empty
      // If they are then return true
      if ($.isEmptyObject($scope.infoForm.$error)){
        return true;
      }

      // If there is an error, loop over all the error fields to display the errors 
      angular.forEach($scope.infoForm.$error, function (field) {
        angular.forEach(field, function(errorField){
          errorField.$setTouched();
        })
      });

      alert("See Form Errors!");
      return false;
    };


    var checkPhotos = function(){
      if (!$scope.user.profilePhoto){
        alert("Need a Profile Photo!");
        return false;
      }

      return true;
    }



  }
});
