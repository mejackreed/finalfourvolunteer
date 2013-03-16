/*
 * Serve JSON to our AngularJS client
 */

var request = require('request');
var mongoose = require("mongoose");

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

// 
// 
// var solarTotals = mongoose.model('SolarTotals', rankingsSchema);
// var elecTotals = mongoose.model('ElectricityTotals', elecCapSchema)
// var solarByYear = mongoose.model('SolarByYear', solarByYearSchema);
// 
// 
// 
// exports.solar = function(req, res) {
	// var type = req.params.variable + " Totals";
	// res.type('json');
	// if (req.params.variable == "yearly") {
		// solarByYear.find({
// 
		// }).exec(function(err, result) {
			// res.json(result)
		// })
	// } else {
		// solarTotals.find({
			// 'name' : type
		// }).exec(function(err, result) {
			// res.json(result)
		// })
	// }
// }
// exports.electricity = function(req, res) {
	// var type = req.params.variable;
	// elecTotals.find({}).exec(function(err, result) {
		// res.json(result)
	// })
// }
// exports.powerplants = function(req, res) {
	// res.send()
// }
// 
// exports.eia = function(req, res) {
	// request('http://api.eia.gov/series/data/?series_id=ELEC.GEN.ALL-AK-99.A&api_key=81E2323A795463EBC653B570F966EF3E', function(e, response, body) {
		// //eia = body
		// eia = JSON.parse(body)
		// //console.log(eia.series_data)
		// res.json(eia.series_data)
	// });
// 
// }
