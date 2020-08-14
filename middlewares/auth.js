const auth = (req, res, next) => {
	if(!req.session.logined)
		return res.redirect('/auth/login');
	next();
};

module.exports = auth;