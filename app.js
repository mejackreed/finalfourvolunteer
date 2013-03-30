/**
 * Module dependencies.
 */
//var flash = require('connect-flash');

var express = require('express'), mongoose = require("mongoose"), routes = require('./routes'), api = require('./routes/api'), passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var db = ('./db.js')
var Schema = mongoose.Schema, passportLocalMongoose = require('passport-local-mongoose');

var app = module.exports = express();

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.static(__dirname + '/public'));
	app.use(flash());
	app.use(express.cookieParser());
	app.use(express.session({
		secret : process.env.SECRET
	}));
	//app.use(mongooseAuth.middleware())
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
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

// requires the model with Passport-Local Mongoose plugged in
var Account = require('./models/account');
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(Account.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/shuttle', routes.shuttle);
app.get('/register', routes.register);
app.get('/admin', ensureAuthenticated, routes.admin);
app.get('/admin/groups', ensureAuthenticated, routes.groupmanage)

app.get('/login', function(req, res) {
	res.render('login', {
		userName : req.user
	});
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.post('/register', function(req, res) {
	Account.register(new Account({
		username : req.body.username
	}), req.body.password, function(err, account) {
		if (err) {
			return res.render('register', {
				account : account
			});
		}

		res.redirect('/');
	});
});

// JSON API
//
app.get('/api/groups/:id', api.groups)
app.get('/api/shuttles', api.shuttle);
app.get('/api/twitter', api.twitter)
app.get('/api/alerts/:id', api.alerts)
app.put('/api/alerts/:id', apiAuth, api.alertput)
app.put('/api/alertsend', apiAuth, api.alertsend)
app.put('/api/twittersend', apiAuth, api.twittersend)
app.put('/api/smssend', apiAuth, api.smssend)

app.put('/api/newgroup', apiAuth, api.newgroup)
app.put('/api/deletegroup', apiAuth, api.deletegroup)
app.put('/api/newrec', apiAuth, api.newrec)
app.put('/api/deleterec', apiAuth, api.deleterec)

app.get('*', routes.index);

// Start server
var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function apiAuth(req, res, next) {
	console.log(req._passport.session.user)
	if (req._passport.session.user != undefined) {
		return next();
	}
	res.redirect('/login')
}

function ensureAuthenticated(req, res, next) {
	console.log(req._passport.session.user)
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login')
}
