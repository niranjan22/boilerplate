'use strict';

//Filemonkeys service used to communicate Filemonkeys REST endpoints
angular.module('filemonkeys').factory('Filemonkeys', ['$resource',
	function($resource) {
		return $resource('filemonkeys/:filemonkeyId', { filemonkeyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);