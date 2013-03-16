/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index');
};

exports.shuttle = function(res, res) {
	res.render('shuttle');
}

exports.signup = function(res, res) {
	res.render('signup');
}

exports.login = function(res, res) {
	res.render('login');
}