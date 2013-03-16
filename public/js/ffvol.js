$(document).ready(function() {
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
		html += '<li class="media"><a class="pull-left" href="http://www.twitter.com/' + value.user.screen_name + '"><img class="media-object" src="' + value.user.profile_image_url + '"></a><div class="media-body"><h4 class="media-heading">' + value.user.screen_name + '</h4><div class="media">' + value.text + '</div></div></li>'
	})
	$('#twitterFeed').html(html)
}
