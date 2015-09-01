'use strict';
// Users controller
angular.module('users').controller('UsersController', ['$scope', '$http', '$stateParams', '$location', '$log', '$filter', 'Authentication', 'Users',
 	function($scope, $http, $stateParams, $location, $log, $filter, Authentication, Users) {
		$scope.authentication = Authentication;
		// Create new User
		$scope.create = function() {
			$http.post('/auth/signup', $scope.user).success(function(response) {
				// And redirect to the index page
				$location.path('/users');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		// Remove existing User
		$scope.remove = function(user) {
			if ( user ) { 
				user.$remove();
				for (var i in $scope.users) {
					if ($scope.users [i] === user) {
						$scope.users.splice(i, 1);
					}
				}
			} else {
				$scope.user.$remove(function() {
					$location.path('users');
				});
			}
		};
		// Update existing User
		$scope.update = function() {
			var user = $scope.user;
			user.$update(function() {
				$location.path('users/' + user._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Find a list of Users
		$scope.find = function() {
			$scope.users = Users.query();
		};
		// Find existing User
		$scope.findOne = function() {
      Users.get({ 
				userId: $stateParams.userId
			})
      .$promise.then(function(data) {
        //data.created = $filter('date')(data.created, 'yyyy-MM-dd');
        $scope.user = data;
      }, function(reason) {
        console.log('Failed: ' + reason);
      });      
		};
	}
]);