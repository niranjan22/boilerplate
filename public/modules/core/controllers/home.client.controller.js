'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        // Some example string
        $scope.helloText = 'Welcome to Invoice';
        $scope.descriptionText = 'This is a web application to create Invoices';
	}
]);