var mongoose = require('mongoose'), Schema = mongoose.Schema
var db = require('./db.js')
var csv = require('csv');
var fs = require('fs');

//console.log(db.Group)
// var recipient1 = new db.Recipients({
// name : 'Jack',
// number : 4043763550
// })
// var recipient2 = new db.Recipients({
// name : 'John',
// number : 5555555555
// })

var recipients = []
var groupName = ''

csv().from.stream(fs.createReadStream(__dirname + '/groupdata.csv')).to.path(__dirname + '/sample.out').transform(function(row) {

	//console.log(row[0])
	return row;
}).on('record', function(row, index) {
	//console.log('#' + index + ' ' + JSON.stringify(row));
	//console.log(row[3])
	groupName = row[3]
	recipients.push({
		name : row[1] + " " + row[0],
		number : row[2],
		valid : true
	})
}).on('end', function(count) {
	var group = new db.Group({
		name : groupName,
		dateCreated : new Date(),
		recipients : recipients,
		valid : true

	})
	group.save(function(err) {
		console.log(err)
	})
	//console.log('Number of lines: ' + count);
}).on('error', function(error) {
	console.log(error.message);
});

