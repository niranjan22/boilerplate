'use strict';

//Expense Types service used to communicate Sequences REST endpoints
angular.module('sequences').factory('Sequences', ['$resource',
	function($resource) {
    console.log(':sequenceId');
		return $resource('sequences/:sequenceId', { sequenceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);