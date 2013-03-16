$(document).ready(function() {
	getAlerts()
	getTweets()
});

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
		html += '<li class="media"><a class="pull-left" href="http://www.twitter.com/' + value.user.screen_name + '"><img class="media-object" src="' + value.user.profile_image_url + '"></a><div class="media-body"><h4 class="media-heading"><a href="http://www.twitter.com/' + value.user.screen_name + '">' + value.user.screen_name + '</a></h4><div class="media">' + value.text + '</div></div></li>'
	})
	$('#twitterFeed').html(html)
}

function getAlerts() {
	$.ajax({
		url : '/api/alerts',
		success : function(data) {
		//	console.log(data)
			postAlerts(data)
		}
	})
}

function postAlerts(data) {
	var html = "";
	_.each(data, function(value) {
		//console.log(value)
		html += "<div class='alert alert-error'><button type='button' class='close' data-dismiss='alert'>&times;</button><p>" + value.alertText + "<strong> Posted " + moment(value.alertTime).format('L LT') + "</strong></p></div>"
	})
	$('#importantInfo').html(html);
}

function testPost() {
	jQuery.ajax({
		url : "/api/alerts",
		type : "PUT",
		data : {
			"alertText" : "This is an alert",
			"alertTime" : new Date(),
			"alertStatus" : true
		},
		success : function(data, textStatus, jqXHR) {
			console.log("Post resposne:");
			console.dir(data);
			console.log(textStatus);
			console.dir(jqXHR);
		}
	});
}
