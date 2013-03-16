/**
 * Module dependencies.
 */
var flash = require('connect-flash');

var express = require('express'), mongoose = require("mongoose"), routes = require('./routes'), api = require('./routes/api'), passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

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

var UserSchema = new mongoose.Schema({
uid : String,
last_name : String,
first_name : String,
twitter_username : String,
email : String,
password : String,
created : {type: Date, default: Date.now}
});

var User = mongoose.model('User', UserSchema);

var app = module.exports = express();

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('keyboard cat'));
	app.use(express.session({
		cookie : {
			maxAge : 60000
		}
	}));
	app.use(express.static(__dirname + '/public'));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({
		username : username
	}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, {
				message : 'Incorrect username.'
			});
		}
		if (!user.validPassword(password)) {
			return done(null, false, {
				message : 'Incorrect password.'
			});
		}
		return done(null, user);
	});
}));

// Routes

app.get('/', routes.index);
app.get('/shuttle', routes.shuttle);
app.get('/signup', routes.signup);
app.get('/login', routes.login);
app.get('/admin', routes.admin);

app.get('/flash', function(req, res) {
	req.flash('info', 'Hi there!')
//	res.redirect('/');
});
// Login

app.post('/login', passport.authenticate('local', {
	successRedirect : '/',
	failureRedirect : '/login',
	failureFlash : true
}));

// JSON API

app.get('/api/schedule/:variable', api.schedule);
app.get('/api/twitter', api.twitter)
app.get('/api/alerts', api.alerts)
app.put('/api/alerts', api.alertpost)
app.put('/api/signup', api.signuppost)

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server
var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
