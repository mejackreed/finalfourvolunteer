$(document).ready(function() {
	getTimes()
	getTweets()
});
//(678) 681-9857



function getTweets() {
	$.ajax({
		url : 'api/twitter',
		success : function(data) {
			displayTwitter(data)
		}
	})
}

function displayTwitter(data) {
	var html = "";
	//console.log(data)
	_.each(data.statuses, function(value) {
		//console.log(value)
		html += '<li class="media"><a class="pull-left" href="http://www.twitter.com/' + value.user.screen_name + '"><img class="media-object" src="' + value.user.profile_image_url + '"></a><div class="media-body"><h4 class="media-heading">' + value.user.screen_name + '</h4><div class="media">' + value.text + '</div></div></li>'
	})
	$('#twitterFeed').html(html)
}

function getTimes() {
	$.ajax({
		url : '/api/schedule/1',
		success : function(data) {
			updateTimes(data)
		}
	})
}

function updateTimes(data) {
	var tables = "<tr><th>Pickup Time</th><th>Pickup Location</th><th>Dropoff Time</th><th>Dropoff Location</th></tr>";
	var nextShuttle = moment('02/22/2015');
	var now = new Date();
	_.each(data, function(value) {
		tables += '<tr><td>' + moment(value.pickupTime).format("MMM Do YY h:mm a") + '</td><td>' + checkLocation(value.pickupLocation) + '</td><td>' + moment(value.dropoffTime).format("MMM Do YY h:mm a") + '</td><td>' + checkLocation(value.dropoffLocation) + '</td></tr>'
		if (nextShuttle > moment(value.pickupTime)) {
			nextShuttle = moment(value.pickupTime)
		}
	})
	$("#pickupTimes").append(tables);
	var fromNow = moment(nextShuttle).fromNow()
	console.log(fromNow)
	// if (endsWith(fromNow)){
	//
	// }
	$('#nextShuttle').html('Next shuttle ' + fromNow)
	console.log(endsWith(fromNow, 'days'))
	console.log(nextShuttle)
}

function checkLocation(value) {
	if (value == "GWCC") {
		return "<a href='https://maps.google.com/maps?q=Georgia+World+Congress+Center,+Atlanta,+GA&hl=en' target=_blank>GWCC</a>"
	} else {
		if (value == "Civic Center") {
			return "<a href='https://maps.google.com/maps?q=Boisfeuillet+Jones+Atlanta+Civic+Center&hl=en' target=_blank>Civic Center</a>"
		}
	}
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
