console.log('hello')

$(function() {
	$("#sendAlertButton").click(function() {
		sendAlert();
	});
});

function sendAlert() {
	console.log($('#alertText').val())
	$.ajax({
		url : "/api/alerts",
		type : "PUT",
		data : {
			"alertText" : $('#alertText').val(),
			"alertTime" : new Date(),
			"alertStatus" : 'true'
		},
		success : function() {

		}
	});
}