/**
 * Module dependencies.
 */

var express = require('express'), mongoose = require("mongoose"), routes = require('./routes'), api = require('./routes/api'), passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var db = ('./db.js')
var MongoStore = require('connect-mongo')(express);

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var Schema = mongoose.Schema, passportLocalMongoose = require('passport-local-mongoose');
var app = module.exports = express();

var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/FinalFourVolunteer';
var mongoOptions = {
	db : {
		safe : true
	}
};
var dbconnect = mongoose.connect(uristring, mongoOptions, function(err, res) {
});
console.log()

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(express.cookieParser());
	app.use(express.session({
		cookie : {
			maxAge : 60000
		},
		secret : process.env.SECRET,
		maxAge : new Date(Date.now() + 3600000),
		store : new MongoStore({
			mongoose_connection : dbconnect.connections[0],
			auto_reconnect : true
		})
	}));
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
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

var Account = require('./models/account');
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.get('/', routes.index);
app.get('/map', routes.map);
app.get('/shuttle', routes.shuttle);
app.get('/register', routes.register);
app.get('/admin', ensureLoggedIn('/login'), routes.admin);
app.get('/admin/groups', ensureLoggedIn('/login'), routes.groupmanage)

app.get('/welcome/sms', function(req, res) {
	res.set('Content-Type', 'text/xml');
	res.send("<?xml version='1.0' ?><Response><Sms>Official Final Four Volunteer line. Note messages sent to this number are not monitored. Reply HELP for help.Reply STOP to unsubscribe.Msg&amp;Data rates may apply.</Sms></Response>")
})

app.get('/login', function(req, res) {
	res.render('login', {
		user : req.user
	});
});

app.post('/login', passport.authenticate('local', {
	successRedirect : '/admin',
	failureRedirect : '/'//,
	//failureFlash : true
}));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.post('/register', function(req, res) {
	if (req.body.code == process.env.REGCODE) {
		Account.register(new Account({
			username : req.body.username
		}), req.body.password, function(err, account) {
			if (err) {
				console.log(err)
				return res.render('register', {
					account : account
				});
			}

			res.redirect('/');
		});
	} else {
		res.redirect('/');
	}
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
	//	console.log(req._passport.session.user)
	if (req._passport.session.user != undefined) {
		return next();
	}
	res.redirect('/login')
}

function ensureAuthenticated(req, res, next) {
	console.log(req.isAuthenticated())
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login')
}
