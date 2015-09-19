'use strict';

//Setting up route
angular.module('filemonkeys').config(['$stateProvider',
	function($stateProvider) {
		// Filemonkeys state routing
		$stateProvider.
		state('listFilemonkeys', {
			url: '/filemonkeys',
			templateUrl: 'modules/filemonkeys/views/list-filemonkeys.client.view.html'
		}).
		state('createFilemonkey', {
			url: '/filemonkeys/create',
			templateUrl: 'modules/filemonkeys/views/create-filemonkey.client.view.html'
		}).
		state('viewFilemonkey', {
			url: '/filemonkeys/:filemonkeyId',
			templateUrl: 'modules/filemonkeys/views/view-filemonkey.client.view.html'
		}).
		state('editFilemonkey', {
			url: '/filemonkeys/:filemonkeyId/edit',
			templateUrl: 'modules/filemonkeys/views/edit-filemonkey.client.view.html'
		});
	}
]);