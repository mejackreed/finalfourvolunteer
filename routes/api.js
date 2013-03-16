
//4048095070

ACCOUNT_SID = 'ACe933fd0423b4672220d2a1bd8f99dd1d';
AUTH_TOKEN = '35966416884bca65cfc25f1a13c62e40';

var request = require('request');
var mongoose = require("mongoose");
var Twit = require('twit');
var client = require('twilio')('ACCOUNT_SID', 'AUTH_TOKEN');

var T = new Twit({
	consumer_key : 'BSs5VlwsHz4sDN45vzfiuQ',
	consumer_secret : 'D36illj5Khhmgq7j8GSewEamLrpf5zZhBv33Ha0mPMg',
	access_token : '1272293040-tOkdQZ3j3rXfm4Y7v2leHAmMHjuj1rutwGE4mMY',
	access_token_secret : 'krBXYTg42vx0LJWGkppgggaEyeD1A3sGuzSVZcZFk'
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
