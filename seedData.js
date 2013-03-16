var mongoose = require("mongoose");
var _ = require('underscore')._;
var request = require('request');
var moment = require('moment');
var csv = require('csv');
var fs = require('fs');

var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/FinalFourVolunteer';

var mongoOptions = {
	db : {
		safe : true
	}
};

mongoose.connect(uristring, mongoOptions, function(err, res) {
	
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

var shuttleTrip = mongoose.model('ShuttleTrips', tripSchema);

shuttleTrip.find({}).remove();

var count = 0;

console.log(moment('12/01/2010').format())

csv().from.stream(fs.createReadStream(__dirname + '/seeddata.csv')).to.path(__dirname + '/sample.out').transform(function(row) {

	//console.log(row[0])
	return row;
}).on('record', function(row, index) {
	//console.log('#' + index + ' ' + JSON.stringify(row));
	var dataRecord = new shuttleTrip({
		pickupTime : moment(row[0] + ' EDT').format(),
		pickupLocation : row[1],
		dropoffLocation : row[2],
		dropoffTime : moment(row[3] + ' EDT').format(),
	})
	count++;
	dataRecord.save(function(err) {
		if (count == 5) {
			mongoose.connection.close()

		}
	})
}).on('end', function(count) {
	//console.log('Number of lines: ' + count);
}).on('error', function(error) {
	console.log(error.message);
});
