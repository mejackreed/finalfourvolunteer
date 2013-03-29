/*
 * GET home page.
 */
var userName = ""

exports.index = function(req, res) {
	res.render('index', {
		user : req.user
		
	});
};

exports.shuttle = function(req, res) {
	res.render('shuttle');
}

exports.register = function(req, res) {
	res.render('register');
}

exports.login = function(req, res) {
	res.render('login');
}

exports.admin = function(req, res) {
	res.render('admin', {
		user : req.user
	});
}
