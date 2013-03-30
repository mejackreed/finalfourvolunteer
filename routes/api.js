//4048095070
var db = require('../db.js');
var _ = require("underscore");

var ACCOUNT_SID = process.env.TWILIO_SID;
var AUTH_TOKEN = process.env.TWILIO_TOKEN;
var twilio_from_number = process.env.TWILIO_FROM;

var request = require('request');
var mongoose = require("mongoose");
var Twit = require('twit');
var client = require('twilio')('ACCOUNT_SID', 'AUTH_TOKEN');
var util = require('util')

//var db = require('./db.js');

var T = new Twit({
	consumer_key : process.env.TWITTER_CONSUMER_KEY,
	consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
	access_token : process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
})

// var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/FinalFourVolunteer';
// var mongoOptions = {
// db : {
// safe : true
// }
// };
var tweets

// mongoose.connect(uristring, mongoOptions, function(err, res) {
// // if (err) {
// // console.log('ERROR connecting to: ' + uristring + '. ' + err);
// // } else {
// // console.log('Succeeded connected to: ' + uristring);
// // }
// });
exports.deleterec = function(req, res) {
	//	console.log(req.body.data)
	db.Group.update({
		_id : req.body.data.groupid
	}, {
		$pull : {
			recipients : {
				_id : req.body.data.recid,
			}
		}
	}, {
		upsert : true
	}, function(err) {
		//	console.log(err)
	})
	res.json(req.params.id)
}

exports.newrec = function(req, res) {
	db.Group.update({
		_id : req.body.data.id
	}, {
		$push : {
			recipients : {
				name : req.body.data.name,
				number : req.body.data.number,
				valid : true,
				_id : req.body.data.id + req.body.data.name
			}
		}
	}, {
		upsert : true
	}, function(err) {
		//	console.log(err)
	})
	res.json(req.params.id)
}

exports.deletegroup = function(req, res) {
	db.Group.update({
		_id : req.body.data
	}, {
		$set : {
			valid : false
		}
	}, {
		upsert : true
	}, function(err) {
		//	console.log(err)
	})
	res.json(req.params.id)
}
exports.newgroup = function(req, res) {
	//console.log(req.body.data)
	var group = new db.Group({
		name : req.body.data,
		dateCreated : new Date(),
		valid : true
	})

	group.save(function(err) {
		console.log('alert saved')
		console.log(err)
		if (err == null) {
			res.json({
				"group" : true
			})
			console.log('mongo success')
		} else {
			res.jsonp({
				"group" : false
			})
		}
	})
}

exports.groups = function(req, res) {
	//console.log(req.params.id)
	//var id = '*'
	if (req.params.id == 'any') {
		db.Group.find({
			valid : true
		}).exec(function(err, result) {
			res.type('application/json');
			res.jsonp({
				data : result
			})
		})
	} else {
		db.Group.find({
			valid : true,
			_id : req.params.id
		}).exec(function(err, result) {
			res.type('application/json');
			res.jsonp({
				data : result
			})
		})
	}

}

exports.alerts = function(req, res) {
	db.Alert.find({
		alertStatus : true
	}).exec(function(err, result) {
		res.type('application/json');
		res.jsonp({
			data : result
		})
	})
}
exports.alertput = function(req, res) {
	db.Alert.update({
		_id : req.params.id
	}, {
		$set : {
			alertStatus : false
		}
	}, {
		upsert : true
	}, function(err) {
		console.log(err)
	})
	res.json(req.params.id)
}
exports.twittersend = function(req, res) {
	T.post('statuses/update', {
		status : req.body.data
	}, function(err, reply) {
		//  ...
		if (err == null) {
			res.json({
				"twitter" : true
			})
		} else {
			res.json({
				"twitter" : false

			})
		}

	})
}

exports.alertsend = function(req, res) {
	//console.log(req.body)
	var status = []
	// console.log(req.body)
	var dataRecord = new db.Alert({
		alertText : req.body.data,
		alertStatus : true,
		alertTime : Date()
	})
	dataRecord.save(function(err) {
		console.log('alert saved')
		console.log(err)
		if (err == null) {
			res.json({
				"mongo" : true
			})
			console.log('mongo success')
		} else {
			res.json({
				"mongo" : false
			})
		}
	})
	// sendSMSMessage(req.body.alertText)
	// //sss();
	while (status.length == 2) {
		res.jsonp(status)
	}
}

exports.smssend = function(req, res) {
	var message = req.body.data.message
	var recipients = req.body.data.recipients
	console.log(message)
	console.log(recipients)
	_.each(recipients, function(rec) {
		sendSMSMessage(message, rec)
	})
	res.jsonp({
		data : 'success'
	})
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

function sendSMSMessage(message, recipient) {
	var twilio_to_number = "+1" + recipient
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

exports.shuttle = function(req, res) {
	var today = new Date()
	var param = req.params.variable;
	//res.json(param)
	db.ShuttleTrips.find({
		pickupTime : {
			'$gte' : new Date()
		}
	}).exec(function(err, result) {
		res.type('application/json');
		res.jsonp({
			data : result
		})
	})
}

exports.twitter = function(req, res) {
	T.get('search/tweets', {
		q : 'FinalFourVols'
	}, function(err, reply) {
		//console.log(reply)
		res.type('application/json');
		res.jsonp(reply)
		//  ...
	})
}
