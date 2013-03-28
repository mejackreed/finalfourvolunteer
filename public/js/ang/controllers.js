'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
	$http({
		method : 'GET',
		url : '/api/name'
	}).success(function(data, status, headers, config) {
		$scope.name = data.name;
	}).error(function(data, status, headers, config) {
		$scope.name = 'Error!'
	});
}

function MyCtrl1() {
}

MyCtrl1.$inject = [];

function MyCtrl2() {
}

MyCtrl2.$inject = [];

// var HomeCtrl = function($scope, $routeParams, $location, $resource) {
// var AlertDB = $resource('/api/alerts/:id', {
// id : '@_id'
// });
// AlertDB.get({
//
// }, function(data) {
// console.log(data)
// })
// }
function groupCtrl($scope, $resource) {

}

function twitterCtrl($scope, $resource) {
	$scope.twitter = $resource('/api/twitter', {

		callback : 'JSON_CALLBACK'
	}, {
		get : {
			method : 'JSONP'
		}
	});

	$scope.twitterResult = $scope.twitter.get();
}

function alertCreateCtrl($scope, $resource, $http) {
	$scope.message = '';
	$scope.sendAlert = function() {
		console.log($scope.message.length)
		if ($scope.message.length > 0 && $scope.message.length < 140) {
			console.log('good')
			$http.put('/api/alertsend', {
				data : $scope.message
			})
		}
	}
}

function alertCtrl($scope, $resource, $http) {
	$scope.alerts = $resource('/api/alerts/:id'), {
		callback : 'JSON_CALLBACK'
	}, {
		get : {
			method : 'JSONP',
		},
		update : {
			method : 'PUT',
		}
	}
	$scope.alertResult = $scope.alerts.get({
		id : 'any'
	})
	//$scope.alertResult = $http.jsonp('/api/alerts/123&JSON_CALLBACK')
	$scope.update = function() {
	}

	$scope.archive = function() {
		var alerts = $scope.alertResult.data
		console.log(alerts)
		$scope.alertResults = [];
		angular.forEach(alerts, function(alert) {
			console.log('for')
			if (!alert.alertStatus) {
				console.log('true')
				var url = '/api/alerts/' + alert._id;
				$http.put(url, {
					params : {
						id : '123'
					}
				})
			}
		});
		$scope.alertResult = $scope.alerts.get({
			id : 'any'
		})

		// $scope.alerts = $scope.alerts.filter(function(alert){
		// console.log(alert)
		// })

	}
	// $scope.alerts = $scope.alerts(function(alert) {
	// if (!alert.alertStatus) {
	// console.log(alert)
	// return false;
	// }
	// return true;
	// });
	// };
}

function shuttleCtrl($scope, $resource) {
	$scope.shuttles = $resource('/api/shuttles', {
		callback : 'JSON_CALLBACK'
	}, {
		get : {
			method : 'JSONP'
		}
	});

	$scope.shuttleResult = $scope.shuttles.get();
}