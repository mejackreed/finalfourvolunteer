//4048095070

var ACCOUNT_SID = process.env.TWILIO_SID;
var AUTH_TOKEN = process.env.TWILIO_TOKEN;
var twilio_from_number = process.env.TWILIO_FROM;

var request = require('request');
var mongoose = require("mongoose");
var Twit = require('twit');
var client = require('twilio')('ACCOUNT_SID', 'AUTH_TOKEN');
var util = require('util')

var T = new Twit({
	consumer_key : process.env.TWITTER_CONSUMER_KEY,
	consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
	access_token : process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
})

var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/FinalFourVolunteer';
var mongoOptions = {
	db : {
		safe : true
	}
};
var tweets

mongoose.connect(uristring, mongoOptions, function(err, res) {
	// if (err) {
	// console.log('ERROR connecting to: ' + uristring + '. ' + err);
	// } else {
	// console.log('Succeeded connected to: ' + uristring);
	// }
});

var alertSchema = new mongoose.Schema({
	alertText : {
		type : String,
	},
	alertTime : {
		type : Date,
	},
	alertStatus : {
		type : Boolean,
	}
})

var tripSchema = new mongoose.Schema({
	pickupLocation : {
		type : String,
	},
	dropoffLocation : {
		type : String,
	},
	pickupTime : {
		type : Date
	},
	dropoffTime : {
		type : Date
	}
})

var userSchema = new mongoose.Schema({
	first_name : {
		type : String,
	},
	last_name : {
		type : String,
	},
	email : {
		type : String
	},
	twitter : {
		type : String
	},
	password : {
		type : String
	}
})

var User = mongoose.model('Users', userSchema);
var shuttleTrips = mongoose.model('ShuttleTrips', tripSchema);
var alert = mongoose.model('Alerts', alertSchema);

exports.alerts = function(req, res) {
	alert.find({
		alertStatus : true
	}).exec(function(err, result) {
		res.json(result)
	})
}

exports.alertpost = function(req, res) {
	console.log(req.body)
	var dataRecord = new alert({
		alertText : req.body.alertText,
		alertStatus : req.body.alertStatus,
		alertTime : req.body.alertTime
	})
	dataRecord.save(function(err) {

	})
	T.post('statuses/update', {
		status : req.body.alertText
	}, function(err, reply) {
		//  ...
		console.log('Twitter post fail: ' + err)
	})
	sendSMSMessage(req.body.alertText)
	//sss();
}
function sss() {
	client.sendSms({
		to : '+14043763550', // Any number Twilio can deliver to
		from : '+16786819857', // A number you bought from Twilio and can use for outbound communication
		body : 'word to your mother.' // body of the SMS message

	}, function(err, responseData) {//this function is executed when a response is received from Twilio
		console.log(err)
		if (!err) {// "err" is an error received during the request, if any

			// "responseData" is a JavaScript object containing data received from Twilio.
			// A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
			// http://www.twilio.com/docs/api/rest/sending-sms#example-1

			console.log(responseData.from);
			// outputs "+14506667788"
			console.log(responseData.body);
			// outputs "word to your mother."

		}
	});
}

function sendSMSMessage(message) {
	var twilio_to_number = "+14043763550"
	//return process.nextTick(function() {
	var https, options, post_data, request;
	https = require('https');
	post_data = "From=" + twilio_from_number + "&To=" + twilio_to_number + "&Body=" + message;
	options = {
		host : 'api.twilio.com',
		path : "/2010-04-01/Accounts/" + ACCOUNT_SID + "/SMS/Messages.json",
		method : 'POST',
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
			'Content-Length' : post_data.length,
			'Authorization' : 'Basic ' + new Buffer(ACCOUNT_SID + ':' + AUTH_TOKEN).toString('base64')
		}
	};
	request = https.request(options, function(response) {
		var str;
		str = '';
		response.on('data', function(chunk) {
			return str += chunk;
		});
		return response.on('end', function() {
			return console.log(util.inspect(str));
		});
	});
	request.write(post_data);
	return request.end;
	//});
};

exports.signuppost = function(req, res) {
	console.log(req)
	var user = new User({
		last_name : req.body.last_name,
		first_name : req.body.first_name,
		email : req.body.email,
		twitter_username : req.body.twitter,
		password : req.body.password
	})
	user.save(function(err) {

	})
}

exports.schedule = function(req, res) {
	var today = new Date()
	var param = req.params.variable;
	//res.json(param)
	shuttleTrips.find({
		pickupTime : {
			'$gte' : new Date()
		}
	}).exec(function(err, result) {
		res.json(result)
	})
}

exports.twitter = function(req, res) {
	T.get('search/tweets', {
		q : 'FinalFourVols'
	}, function(err, reply) {
		//console.log(reply)
		res.json(reply)
		//  ...
	})
}
