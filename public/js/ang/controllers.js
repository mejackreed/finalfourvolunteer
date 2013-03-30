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


function groupCtrl($scope, $resource, $http) {
	$scope.currentPage = 0;
	$scope.pageSize = 8;
	$scope.numberOfPages = function() {
		if ($scope.recipients == undefined) {
			return ""
		} else {
			return Math.ceil($scope.recipients.length / $scope.pageSize);
		}
	}

	$scope.showAddRec = false;
	$scope.groups = $resource('/api/groups/:id'), {
		callback : 'JSON_CALLBACK'
	}, {
		get : {
			method : 'JSONP',
		},
		update : {
			method : 'PUT',
		}
	}
	$scope.groupResult = $scope.groups.get({
		id : 'any'
	})

	$scope.getRecipients = function(group) {
		$scope.currentPage = 0;
		if (group == null) {
			$scope.showAddRec = false;
			$scope.recipients = null

		} else {
			//console.log(group)
			$scope.activeGroupID = group._id
			$scope.activeGroup = group;
			$scope.groupName = group.name;
			$scope.recipients = group.recipients;
			$scope.showAddRec = true;
		}
	}
	$scope.addRec = function() {
		//	console.log($scope.newGroup)
		//$scope.groupStatus = "icon-spinner icon-spin"
		$http.put('/api/newrec', {
			data : {
				name : $scope.newRecName,
				number : $scope.newRecNumber,
				id : $scope.activeGroup._id
			}
		}).success(function(data) {
			$scope.recipients.push({
				name : $scope.newRecName,
				number : $scope.newRecNumber,
				_id : $scope.activeGroup._id + $scope.newRecName
			})
			//	console.log(data)
			$scope.newRecName = '';
			$scope.newRecNumber = '';
			$scope.currentPage = $scope.numberOfPages() - 1

			//		$scope.groupStatus = "icon-check"
		}).error(function(data) {
			//	console.log(data)
			//		$scope.groupStatus = "icon-remove"

		})
	}

	$scope.deleteRec = function(rec) {
		if (confirm('Are you sure you want to delete this recipient from this group?')) {
			$http.put('/api/deleterec', {
				data : {
					groupid : $scope.activeGroup._id,
					recid : rec._id
				}
			}).success(function(data) {
				var index = findWithAttr($scope.recipients, '_id', rec._id)
				$scope.recipients.remove(index, index)

			}).error(function(data) {
			})
			$scope.groupResult = $scope.groups.get({
				id : 'any'
			})

		}
	}

	$scope.addGroup = function() {
		$scope.groupStatus = "icon-spinner icon-spin"
		$http.put('/api/newgroup', {
			data : $scope.newGroup
		}).success(function(data) {
			$scope.groupStatus = "icon-check"
		}).error(function(data) {
			console.log(data)
			$scope.groupStatus = "icon-remove"

		})
		$scope.newGroup = ''
		$scope.groupResult = $scope.groups.get({
			id : 'any'
		})
	}

	$scope.deleteGroup = function(group) {
		if (confirm('Are you sure you want to delete this group?')) {
			$scope.groupStatus = "icon-spinner icon-spin"
			$http.put('/api/deletegroup', {
				data : group._id
			}).success(function(data) {
				$scope.getRecipients(null)

			}).error(function(data) {
			})
			$scope.groupResult = $scope.groups.get({
				id : 'any'
			})

		}
	}
}

function recipientCtrl($scope, $resource) {
	//$scope.recipients =
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
	$scope.button = 'Send Alert';
	$scope.postTwitter = true;
	$scope.postWebsite = true;
	$scope.postSMS = true;
	$scope.reset = function() {
		$scope.message = "";
		$scope.postTwitter = true;
		$scope.postWebsite = true;
		$scope.postSMS = true;
		$scope.websiteStatus = "";
		$scope.smsStatus = "";
		$scope.twitterStatus = "";
	}

	$scope.groups = $resource('/api/groups/:id'), {
		callback : 'JSON_CALLBACK'
	}, {
		get : {
			method : 'JSONP',
		},
		update : {
			method : 'PUT',
		}
	}
	$scope.groupResult = $scope.groups.get({
		id : 'any'
	})

	$scope.sendAlert = function() {
		if ($scope.message.length > 0 && $scope.message.length < 140) {
			if ($scope.postWebsite) {
				$scope.websiteStatus = "icon-spinner icon-spin"
				$http.put('/api/alertsend', {
					data : $scope.message
				}).success(function(data) {
					$scope.websiteStatus = "icon-check"
					//console.log(data)
				})
			}
			if ($scope.postTwitter) {
				$scope.twitterStatus = "icon-spinner icon-spin"
				$http.put('/api/twittersend', {
					data : $scope.message
				}).success(function(data) {
					$scope.twitterStatus = "icon-check"

				})
			}
			if ($scope.postSMS) {

				var groupToSend = _.findWhere($scope.groupResult.data, {
					send : true
				})
				var recipients = [];

				console.log(groupToSend.recipients[0])
				$.each(groupToSend.recipients, function(i, value) {
					recipients.push(value.number);
				})
				//console.log(recipients)
				$scope.smsStatus = "icon-spinner icon-spin"
				$http.put('/api/smssend', {
					data : {
						message : $scope.message,
						recipients : recipients
					}
				}).success(function(data) {
					$scope.smsStatus = "icon-check"
				}).error(function(data) {
					console.log(data)
					$scope.smsStatus = "icon-remove"

				})
			}

			$scope.message = "";
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

function findWithAttr(array, attr, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i][attr] === value) {
			return i;
		}
	}
}

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};
