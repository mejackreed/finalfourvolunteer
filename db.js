var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/FinalFourVolunteer';
var mongoOptions = {
	db : {
		safe : true
	}
};

var db = mongoose.connect(uristring, mongoOptions, function(err, res) {
	// if (err) {
	// console.log('ERROR connecting to: ' + uristring + '. ' + err);
	// } else {
	// console.log('Succeeded connected to: ' + uristring);
	// }
});

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	username : {
		type : String
	},
	password : {
		type : String
	}
})

var groupSchema = new Schema({
	name : {
		type : String
	},
	dateCreated : {
		type : Date
	},
	recipients : {
		type : Array
	},
	valid : {
		type : Boolean
	}
})

//Account.plugin(passportLocalMongoose);

var alertSchema = new Schema({
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

var tripSchema = new Schema({
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

exports.Group = mongoose.model('groups', groupSchema);
exports.User = mongoose.model('users', userSchema);
exports.ShuttleTrips = mongoose.model('shuttleTrips', tripSchema);
exports.Alert = mongoose.model('alerts', alertSchema);
