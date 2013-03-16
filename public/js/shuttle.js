$(document).ready(function() {
	getTimes()
});
//(678) 681-9857

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
	//console.log(fromNow)
	// if (endsWith(fromNow)){
	//
	// }
	$('#nextShuttle').html('Next shuttle ' + fromNow)
	//console.log(endsWith(fromNow, 'days'))
	//console.log(nextShuttle)
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
