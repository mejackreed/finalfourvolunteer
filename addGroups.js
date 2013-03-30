var mongoose = require('mongoose'), Schema = mongoose.Schema
var db = require('./db.js')

//console.log(db.Group)
// var recipient1 = new db.Recipients({
// name : 'Jack',
// number : 4043763550
// })
// var recipient2 = new db.Recipients({
// name : 'John',
// number : 5555555555
// })

var group = new db.Group({
	name : "Test Group 1",
	dateCreated : new Date(),
	recipients : [{
		name : 'Jack',
		number : '4043763550'
	}, {
		name : 'John',
		number : '5555555555'
	}],
	valid : true

})
group.save(function(err) {
	console.log(err)
})
