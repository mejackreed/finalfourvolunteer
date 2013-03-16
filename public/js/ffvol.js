$(document).ready(function() {
	getTimes()
});

function getTimes() {
	$.ajax({
		url : '/api/schedule/1',
		success : function(data) {
			console.log(data)
			updateTimes(data)
		}
	})
}

function updateTimes(data) {
	var tables = "<tr><th>Pickup Time</th><th>Pickup Location</th><th>Dropoff Time</th><th>Dropoff Location</th></tr>";
	_.each(data, function(value) {
		tables += '<tr><td>' + moment(value.pickupTime).format("MMM Do YY h:mm a") + '</td><td>' + checkLocation(value.pickupLocation) + '</td><td>' + moment(value.dropoffTime).format("MMM Do YY h:mm a") + '</td><td>' + checkLocation(value.dropoffLocation) + '</td></tr>'
	})
	$("#pickupTimes").append(tables);
}
function checkLocation(value){
	if (value == "GWCC"){
		return "<a href='https://maps.google.com/maps?q=Georgia+World+Congress+Center,+Atlanta,+GA&hl=en' target=_blank>GWCC</a>" 
	}else{
		if (value == "Civic Center"){
			return "<a href='https://maps.google.com/maps?q=Boisfeuillet+Jones+Atlanta+Civic+Center&hl=en' target=_blank>Civic Center</a>"
		}
	}
}
