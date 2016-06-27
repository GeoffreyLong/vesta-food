angular.module('storeEdit').component('storeEdit', {
  templateUrl: 'store-edit/store-edit.template.html',
  controller: function StoreEditController($scope, $location, $http, $mdDialog, $mdMedia, 
                                          dataService, NgMap) {
    // This will almost certainly be cached
    // TODO add in the dataService function

    // NOTE might not be the best way to handle the path...
    //      This is the same way as is done in app.config.js
    var re = new RegExp("\/store\/(.*)\/edit");
    var storeId = re.exec($location.path())[1];    

    // Temporary seed locations
    var tempLat = 45.508596;
    var tempLng = -73.57496800000001;
    
    // Needed to pass to dialog
    dataService.setStore($scope.store);

    if (!$scope.store){
      $http.get('/api/store/' + storeId).then(function(store) {
        $scope.store = store.data;

        // Temporary seed locations
        $scope.store.pickupAddress.lat = tempLat;
        $scope.store.pickupAddress.lng = tempLng;

        // Needed to pass to dialog
        dataService.setStore($scope.store);
      }, function(err) {
      });;
    }

    this.getNumber = function(num) {
      return new Array(num);   
    }        
    
    this.showPanel = function(ev) {
      console.log("ok");
    }
    
    $scope.showConfirm = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: function DialogController(dataService, $scope, $mdDialog){
          var store = dataService.getStore();
          $scope.myImage = store.profilePhoto;
          $scope.myCroppedImage='';

          $scope.handleFileSelect = function(files) {
            console.log("ok");
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
        fullscreen: useFullScreen
      })
      .then(function(answer) {
        // NOTE might want to consider saving this here to the DB as a temp file
        $scope.store.profilePhoto = answer;
      }, function() {
        // Error?
      });
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

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


    $scope.saveChanges = function() {
      // TALK
      // Should I be saving these as I go along?
      // Probably wouldn't be too difficult
    }
    /*
    this.savePhoto = function(file) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      $http.post(uploadUrl, fd, {
          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
      }).success( ...all right!... ).error( ..damn!... );
    })
    */


    /*  IF I WANT TO GO WITH NG-FILE-UPLOAD
    //inject angular file upload directives and service.
    angular.module('myApp', ['angularFileUpload']);

    var MyCtrl = [ '$scope', '$upload', function($scope, $upload) {
      $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
          var file = $files[i];
          $scope.upload = $upload.upload({
            url: 'server/upload/url', //upload.php script, node.js route, or servlet url
            data: {myObj: $scope.myModelObj},
            file: file,
          }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            console.log(data);
          });
        }
      };
    }];
    */


  }
});
