'use strict';

// Filemonkeys controller
angular.module('filemonkeys').controller('FilemonkeysController', ['$scope', '$state', '$stateParams', '$location', '$http', '$modal', '$log', 'Authentication', 'Filemonkeys', 'Upload',
	function($scope, $state, $stateParams, $location, $http, $modal, $log, Authentication, Filemonkeys, Upload) {
		$scope.authentication = Authentication;
    $scope.filemonkeys = [];
    $scope.uploadFiles = function(files, obj) {
      if(files){
         Upload.upload({
            url: '/filemonkeys',
            //fields: {'username': 'rajasekaran'},
            file: files
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          if (status===200){
            if (obj){
              data.forEach (function (item) {
                obj.files.push(item._id);
              });
               obj.$update(function() {
                console.log('success');
              }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
              });             
            }
            $state.reload();
          }
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        });        
        $scope.files = null;
      }
    };

    

		// Remove existing Filemonkey
		$scope.remove = function(filemonkey) {
			if ( filemonkey ) { 
				filemonkey.$remove();

				for (var i in $scope.filemonkeys) {
					if ($scope.filemonkeys [i] === filemonkey) {
						$scope.filemonkeys.splice(i, 1);
					}
				}
			} else {
				$scope.filemonkey.$remove(function() {
					$location.path('filemonkeys');
				});
			}
		};
    
		// Remove existing Filemonkey
		$scope.removefile = function(id, index, obj) {
      obj.files.splice(index,1);
      if (obj.files.length===0){
        obj.files.splice(index,0);
        obj.files = '';
        obj.files = [];
      }

      obj.$update(function(data) {

        $http.delete('/filemonkeys/' + id,{}).success(function (data, status) {
          if (status === 200){
            $state.reload();
          }
        });           
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      
      
		};    
    
		// Find a list of Filemonkeys
		$scope.find = function() {
			$scope.filemonkeys = Filemonkeys.query();
      console.log('fm',$scope.filemonkeys);
		};

		// Find existing Filemonkey
		$scope.findOne = function() {
			$scope.filemonkey = Filemonkeys.get({ 
				filemonkeyId: $stateParams.filemonkeyId
			});
		};
    
    $scope.fileList = function () {
      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'fileList.html',
        controller: 'fileListCtrl',
        size: 'sm',
        resolve: {
          filemonkey: function () {
            var filemonkey = {};
            return filemonkey;
          }
        }
      });

      modalInstance.result.then(function (result) {
        console.log('result',result);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    
	}
]);

angular.module('filemonkeys').controller('fileListCtrl', function ($scope, $modalInstance, filemonkey) {

  $scope.ok = function () {
    $modalInstance.close($scope.filemonkey);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});
