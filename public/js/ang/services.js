'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).factory('Alerts', function($resource) {
	return $resource('/api/alerts/:id', {}, {
		query : {
			method : 'GET'
		},
		update : {
			method : 'PUT'
		}
	});
});

