	/*
	 * GET home page.
	 */
	
	exports.index = function(req, res) {
		res.render('index');
	};
	
	exports.shuttle = function(req, res) {
		res.render('shuttle');
	}
	
	exports.signup = function(req, res) {
		res.render('signup');
	}
	
	exports.login = function(req, res) {
		res.render('login');
	}
	
	exports.admin = function(req, res) {
		res.render('admin');
	}
