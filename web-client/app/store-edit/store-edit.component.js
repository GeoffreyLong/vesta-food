angular.module('storeEdit').component('storeEdit', {
  templateUrl: 'store-edit/store-edit.template.html',
  controller: function StoreEditController($scope, $location, $http, $mdDialog, $mdMedia, 
                                          dataService, NgMap, Upload, $q) {
    // This will almost certainly be cached
    // TODO add in the dataService function

    // NOTE might not be the best way to handle the path...
    //      This is the same way as is done in app.config.js
    var re = new RegExp("\/store\/(.*)\/edit");
    var storeId = re.exec($location.path())[1];    

    // Needed to pass to dialog
    dataService.setStore($scope.store);
    $scope.clonedStore = dataService.getClonedStore();

    if (!$scope.store){
      $http.get('/api/store/' + storeId).then(function(store) {
        $scope.store = store.data;

        // Needed to pass to dialog
        dataService.setStore($scope.store);
        $scope.clonedStore = dataService.getClonedStore();
      }, function(err) {
      });;
    }


    this.getNumber = function(num) {
      return new Array(num);   
    }        
    
    $scope.showConfirm = function(ev, photo, num) {
      // So we can retreive the photo in the new scope
      dataService.setEditPhoto(photo);
      
      // TODO fix this hack
      //      Need to be able to pass in a field 
      //      that can be updated in the "then" callback.
      //      The then works if I do something like $scope.store.profilePhoto = answer
      //      but this is not extensible
      $scope.photoNum = num;

      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: function DialogController(dataService, $scope, $mdDialog, locals){
          var photo = dataService.getEditPhoto();
          $scope.myImage = photo;
          $scope.myCroppedImage='';
          $scope.photoNum = locals.photoNum;

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
        templateUrl: 'store-edit/imageCropDialog.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals: { photoNum: $scope.photoNum }
      })
      .then(function(answer) {
        // NOTE might want to consider saving this here to the DB as a temp file
        console.log(answer);
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
      if ($scope.photoNum == 0) {
        $scope.store.profilePhoto = tmpImage;
      }
      else {
        $scope.store.foods[$scope.photoNum-1].photo = tmpImage;
      }


      var image = $scope.blobConversion(tmpImage);

      var photoData = {
        image: image,
      };
      var fd = new FormData();
      fd.append('file', photoData);

      // Can add progress which is kindof cool 
      //    .progress(function(evt) { parseInt(100.0 * evt.loaded / evt.total); });
      Upload.upload({
        url: '/api/store/edit/photo',
        headers : {
            'Content-Type': 'multipart/form-data'
        },
        arrayKey: '',
        data: photoData
      }).then(function(data, status, headers, config){
        if (data.status == 200) {
          if ($scope.photoNum == 0) {
            // Update the photo for the view
            $scope.store.profilePhoto = data.data;
          }
          else {
            $scope.store.foods[$scope.photoNum-1].photo = data.data;
          }
        }
        else {
          //TODO error handling
        }
      });

    };

    $scope.alternatePhotoSave = function() {
      // NOTE
      //      It is possible to upload all of the data in one shot
      //      For each photo that has been altered, first convert it to a blob
      //      then use the foodName / profilePhoto to label 
      //      fd.append('<fieldName>', storeData);
      //      For instance, if the food was chili then
      //        fd.append('chili', storeData);
      //      Then on the server you could pair each req.file fieldname
      //      with the proper field in the store object
      //      This would reduce server load, but I think it might be bad practice?

    }

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

    // Callback to set the map after map initializes
    NgMap.getMap().then(function(map) {
      $scope.map = map;
    });
    $scope.placeChanged = function() {
      // console.log(this.getPlace());
      var place = this.getPlace();
      var coords = place.geometry.location;
      $scope.store.pickupAddress.lat = coords.lat();
      $scope.store.pickupAddress.lng = coords.lng();
    }

    // INTERESTING  passing in store and cloned store to this fn renders this useless
    //              I guess the variable binding makes this so
    $scope.checkEquality = function(){
      // If either is undefined then just say they are equal 
      // This will avoid the initial flash at the beginning
      if (!$scope.store || !$scope.clonedStore) return true;
      return (JSON.stringify($scope.store) === JSON.stringify($scope.clonedStore));
    }

    $scope.saveStoreInfo = function() {

    }
    $scope.saveFoodItem = function() {

    }
    $scope.saveChanges = function() {
      // Send everything to the backend
      // Photos are moved from /tmp to the regular img directory

      // Validate the forms and the photos 
      // If falid then send the updated / new store to the servers
      if (checkForms() && checkPhotos()){
        var storeData = $scope.store;
        $http.post('api/stores/' + storeData._id, {
          data: storeData
        }).then(function(data) {
          var re = new RegExp("\/store\/(.*)\/edit");
          var storeId = re.exec($location.path())[1];    
          $location.path("/store/" + storeId);
        }, function(err) {
          // TODO error handling
        });
      }

    }

    checkForms = function(){
      // If there is an error, loop over all the error fields to display the errors 
      if ($scope.storeForm.$error || $scope.foodForm.$error){
        angular.forEach($scope.storeForm.$error, function (field) {
          angular.forEach(field, function(errorField){
            errorField.$setTouched();
          })
        });
        // TODO is there a better way to do this?
        angular.forEach($scope.foodFormContainer.$error, function (field) {
          angular.forEach(field, function(innerForm){
            angular.forEach(innerForm.$error, function(innerField){
              angular.forEach(innerField, function(innerErrorField){
                innerErrorField.$setTouched();
              })
            })
          })
        });
        alert("See Form Errors!");
        return false;
      }
      return true;
    }

    checkPhotos = function(){
      if (!$scope.store.profilePhoto){
        alert("Need a Profile Photo!");
        return false;
      }

      var numMissingPhotos = 0;
      $scope.store.foods.forEach(function(food){
        if (!food.photo){
          numMissingPhotos ++;
        }
      });
      if (numMissingPhotos !== 0) {
        alert("Missing " + numMissingPhotos + " food Photos!");
        return false;
      }

      return true;
    }

    $scope.resetChanges = function() {
      $scope.store = dataService.getClonedStore();
    }


    $scope.addFood = function() {
      // TODO should avoid the client adding multiple of these dummy fields
      //      possibly by putting things like <> in the name which is prohibited elsewise
      // NOTE could make the transition a bit swankier... 
      //      like scroll down with the add button
      var newFood = {
        // I could put things like default photos in here...
      }
      $scope.store.foods.push(newFood);
    }
  }
});
