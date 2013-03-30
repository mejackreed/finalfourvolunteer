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

// var recipientSchema = new Schema({
	// name : {
		// type : String
	// },
	// number : {
		// type : Number
	// },
	// valid : {
		// type : Boolean
	// }
// })

//var Recipient = mongoose.model('recipients', recipientSchema)

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

var Account = new Schema({

})

Account.plugin(passportLocalMongoose);

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

// var userSchema = new Schema({
// first_name : {
// type : String,
// },
// last_name : {
// type : String,
// },
// email : {
// type : String
// },
// twitter : {
// type : String
// },
// password : {
// type : String
// }
// })
//
// alertSchema.methods.query = function() {
// console.log("Queried.");
// };
// alertSchema.methods.get = function() {
// console.log("Got.")
// }
// alertSchema.methods.put = function() {
// console.log("Put.")
// }
// alertSchema.methods.post = function() {
// console.log("Posted.")
// }
// alertSchema.methods.
// delete    =
// function() {
// console.log("Deleted.")
// }
//
// tripSchema.methods.query = function() {
// console.log("Queried.");
// };
// tripSchema.methods.get = function() {
// console.log("Got.")
// }
// tripSchema.methods.put = function() {
// console.log("Put.")
// }
// tripSchema.methods.post = function() {
// console.log("Posted.")
// }
// tripSchema.methods.
// delete    =
// function() {
// console.log("Deleted.")
// }

//module.exports = mongoose.model('Account', Account);
//exports.Recipient = mongoose.model('recipients', recipientSchema)
//exports.Admin = mongoose.model('admins', adminSchema);
exports.Group = mongoose.model('groups', groupSchema);
//exports.User = mongoose.model('users', userSchema);
exports.ShuttleTrips = mongoose.model('shuttleTrips', tripSchema);
exports.Alert = mongoose.model('alerts', alertSchema);
