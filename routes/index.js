/*
 * GET home page.
 */

exports.index = function(req, res) {
	console.log(req.user)
	res.render('index');
};

exports.about = function(req, res) {
	console.log(req.user)
	res.render('about');
};

exports.shuttle = function(req, res) {
	console.log(req.user)

	res.render('shuttle');
}

exports.register = function(req, res) {
	console.log(req.user)

	res.render('register');
}

exports.login = function(req, res) {
	res.render('login');
}

exports.admin = function(req, res) {
	res.render('admin');
}

exports.groupmanage = function(req, res) {
	res.render('groupmanage')
}
