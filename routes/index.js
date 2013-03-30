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
	res.render('shuttle', {
		user : req.user
	});
}

exports.register = function(req, res) {
	res.render('register');
}

exports.login = function(req, res) {
	res.render('login', {
		user : req.user
	});
}

exports.admin = function(req, res) {
	res.render('admin', {
		user : req.user
	});
}

exports.groupmanage = function(req, res) {
	res.render('groupmanage', {
		user : req.user
	})
}
