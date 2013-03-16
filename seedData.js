var mongoose = require("mongoose");
var _ = require('underscore')._;
var request = require('request');
var moment = require('moment');
var csv = require('csv');

var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/FinalFourVolunteer';

var mongoOptions = {
	db : {
		safe : true
	}
};

mongoose.connect(uristring, mongoOptions, function(err, res) {
	// if (err) {
	// console.log('ERROR connecting to: ' + uristring + '. ' + err);
	// } else {
	// console.log('Succeeded connected to: ' + uristring);
	// }
});

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

var shuttleTrips = mongoose.model('ShuttleTrips', tripSchema);
console.log(moment('12/01/2010'))

csv().from.stream(fs.createReadStream(__dirname + '/seeddata.js').transform(function(data) {
	console.log(data)
	//sleep.sleep(1)
}))
// //
// // value = getLatLng()
// //console.log(lat)
// // data.push('test')
// return data;
// }).
// on('record', function(data, index) {
//
// console.log('#' + index + ' ' + JSON.stringify(data));
//
// }).on('end', function(count) {
// console.log('Number of lines: ' + count);
// }).on('error', function(error) {
// console.log(error.message);
// });

