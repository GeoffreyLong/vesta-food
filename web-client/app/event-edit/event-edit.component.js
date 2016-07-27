angular.module('eventEdit').component('eventEdit', {
  templateUrl: 'event-edit/event-edit.template.html',
  controller: function EventEditController($scope, $location, $http, dataService,
                                            $mdMedia, $mdDialog, NgMap, Upload, authService){

    $scope.event = {};
    dataService.setEvent($scope.event);
    $scope.clonedEvent = dataService.getClonedEvent();

    var re = new RegExp("\/event\/(.*)\/edit");
    if (re.exec($location.path())) {
      var eventId = re.exec($location.path())[1];
      $http.get('/api/event/' + eventId).then(function(event) {
        $scope.event = event.data;

        $scope.event.date = new Date($scope.event.startDateTime);
        $scope.event.startTime = new Date($scope.event.startDateTime);
        $scope.event.endTime = new Date($scope.event.endDateTime);

        dataService.setEvent($scope.event);
        $scope.clonedEvent = dataService.getClonedEvent();

        setTimeout(function(){
          $('.md-datepicker-input-container').removeClass('md-datepicker-invalid');
        }, 100);
      }, function(err) {
      });
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

    $scope.showHourConfirmDialog = function() {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: function DialogController($mdDialog, $scope){
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
        templateUrl: 'store-edit/hourConfirm.template.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
      })
      .then(function(answer) {
        // NOTE might want to consider saving this here to the DB as a temp file
        if (answer === 'true') {
          console.log("ok");
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
        $scope.event.profilePhoto = tmpImage;
      }
      else {
        $scope.event.foods[$scope.photoNum-1].photo = tmpImage;
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
        url: '/api/edit/photo',
        headers : {
            'Content-Type': 'multipart/form-data'
        },
        arrayKey: '',
        data: photoData
      }).then(function(data, status, headers, config){
        if (data.status == 200) {
          if ($scope.photoNum == 0) {
            // Update the photo for the view
            $scope.event.profilePhoto = data.data;
          }
          else {
            $scope.event.foods[$scope.photoNum-1].photo = data.data;
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
      if (place.geometry) {
        var coords = place.geometry.location;
        $scope.event.address.lat = coords.lat();
        $scope.event.address.lng = coords.lng();
      }
    }

    // INTERESTING  passing in store and cloned store to this fn renders this useless
    //              I guess the variable binding makes this so
    $scope.checkEquality = function(){
      // If either is undefined then just say they are equal 
      // This will avoid the initial flash at the beginning
      if (!$scope.event || !$scope.clonedEvent) return true;
      return (JSON.stringify($scope.event) === JSON.stringify($scope.clonedEvent));
    }

    $scope.saveStoreInfo = function() {

    }
    $scope.saveFoodItem = function() {

    }
    $scope.saveChanges = function() {
      // Send everything to the backend
      // Photos are moved from /tmp to the regular img directory

      // Validate the forms and the photos 
      // If valid then send the updated / new store to the servers
      if (checkForFood() && checkForms() && checkPhotos()){
        console.log($scope.event);
        var data = $scope.event;
        var session = authService.getSessionSynch();
        data.host = session.user._id;
        $http.post('api/event/' + data._id, {
          data: data
        }).then(function(data) {
          $location.path("/event/" + data.data._id);
        }, function(err) {
          // TODO error handling
          console.log(err);
        });
      }

    }


    // Simply checks to see if a food object is there
    // NOTE may not want to require in later versions
    var checkForFood = function() {
      if (!$scope.event.foods || $scope.event.foods.length === 0){
        alert("You need at least one food item for your Event");
        return false;
      }
      return true;
    };

    var checkForms = function() {
      // Check to see if the error objects are empty
      // If they are then return true
      if ($.isEmptyObject($scope.infoForm.$error) 
          && $.isEmptyObject($scope.foodFormContainer.$error)
          && checkHours()){
        return true;
      }

      // If there is an error, loop over all the error fields to display the errors 
      angular.forEach($scope.infoForm.$error, function (field) {
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
    };

    var checkHours = function() {
      var event = $scope.event;
      var date = event.date;
      var startTime = event.startTime;
      var endTime = event.endTime;

      if (!date || !startTime || !endTime) {
        return false;
      } 

      // Construct a start DateTime without modifying store.date
      var start = new Date(date);
      start.setHours(startTime.getHours());
      start.setMinutes(startTime.getMinutes());

      // Construct a start DateTime without modifying store.date
      var end = new Date(date);
      end.setHours(endTime.getHours());
      end.setMinutes(endTime.getMinutes());

      // Ensure start DateTime is later than right now
      // TODO Specific $error messages
      //      Like $scope.storeForm.date.$setValidity("afterNow", false);
      //      Then in template have an ng-message for date.$error.afterNow
      //      Like ng-message="afterNow"
      //      You might actually just add this to the ngModel though
      //      So like ngModel.$setValidity("afterNow", false)... I'm not 100p on this
      if (start < Date.now()){
        // For now will not use the confirm dialog, only alerts
        // $scope.showHourConfirmDialog();
        alert("WARNING: Store opening hour before current hour");
      }
      if (end < Date.now() || endTime <= startTime) {
        alert("Store Hour Errors");
        return false;
      }

      $scope.event.startDateTime = start;
      $scope.event.endDateTime = end;
      return true;
    };

    var checkPhotos = function(){
      /*
      if (!$scope.event.profilePhoto){
        alert("Need a Profile Photo!");
        return false;
      }
      */

      var numMissingPhotos = 0;
      $scope.event.foods.forEach(function(food){
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
      $scope.event = dataService.getClonedEvent();
    }

    $scope.swapFoods = function(indexOne, indexTwo) {
      var temp = $scope.event.foods[indexOne];
      $scope.event.foods[indexOne] = $scope.event.foods[indexTwo];
      $scope.event.foods[indexTwo] = temp;
    }

    $scope.addFood = function() {
      if (!$scope.event.foods) $scope.event.foods = [];
      // TODO should avoid the client adding multiple of these dummy fields
      //      possibly by putting things like <> in the name which is prohibited elsewise
      // NOTE could make the transition a bit swankier... 
      //      like scroll down with the add button
      var newFood = {
        // I could put things like default photos in here...
      }
      $scope.event.foods.push(newFood);
    }

    // Takes the foodIndex as an argument
    // Removes the food item at the foodIndex in the foods array
    $scope.deleteFood = function(foodIndex) {
      $scope.event.foods.splice(foodIndex,1);
      console.log($scope.event);
    }
  }
});
