'use strict';
// Sequences controller
angular.module('sequences').controller('SequencesController', ['$scope', '$modal', '$stateParams', '$location', '$log', '$filter', 'Authentication', 'Sequences',
 	function($scope, $modal, $stateParams, $location, $log, $filter, Authentication, Sequences) {
		$scope.authentication = Authentication;
    //bookmark
    $scope.sequence={};
    //init method
    $scope.init = function () {
    };    
		// Create new Sequence
		$scope.create = function() {
			// Create new Sequence object
			var sequence = new Sequences (this.sequence);
      sequence.created = Date.now;
			// Redirect after save
			sequence.$save(function(response) {
				//$location.path('sequences/' + response._id);
        $location.path('sequences');
				// Clear form fields
        $scope.name= null;
        $scope.seqNumber= null;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Remove existing Sequence
		$scope.remove = function(sequence) {
			if ( sequence ) {
				sequence.$remove();
				for (var i in $scope.sequences) {
					if ($scope.sequences [i] === sequence) {
						$scope.sequences.splice(i, 1);
					}
				}
			} else {
				$scope.sequence.$remove(function() {
					$location.path('sequences');
				});
			}
		};
		// Update existing Sequence
		$scope.update = function() {
			var sequence = $scope.sequence;
			sequence.$update(function() {
				$location.path('sequences/' + sequence._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Find a list of Sequences
		$scope.find = function() {
			$scope.sequences = Sequences.query();
		};
		// Find existing Sequence
		$scope.findOne = function() {
      Sequences.get({
				sequenceId: $stateParams.sequenceId
			})
      .$promise.then(function(data) {
        console.log('data', data);
        $scope.sequence = data;
      }, function(reason) {
        console.log('Failed: ' + reason);
      });
		};
	}
]);