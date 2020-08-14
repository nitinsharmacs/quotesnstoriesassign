const bcryptjs = require('bcryptjs');
const User = require('../../modals/users/users');
const Permissions = require('../../modals/permissions/permissions');
const makeError = require('../../util/util').makeError;
const { validationResult } = require('express-validator/check');

exports.getSignup = (req, res) => {
	res.render('auth/signup', {title:'Register', error:req.flash('signuperror'), message:req.flash('message')});
};

exports.postSignup = (req, res, next) => {

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		const error = errors.array()[0].msg;

		req.flash('signuperror', error);
		return res.redirect('/auth/signup');
	}

	

	const { email, password, role } = req.body;
	User.findUser(email).then(result=>{
		if(!result)
			throw makeError('Internal server error');
		if(result.length>0){
			throw makeError('User exists', 442);
		}
		let passcode = bcryptjs.hashSync(password, 12);
		let newUser = new User({
			email:email,
			password:passcode,
			role:role
		});
		return newUser.save();
	}).then(result=>{
		if(result.length<=0)
			throw makeError('User not added');
		let permission = new Permissions({
			email:email,
			accessRedButton:role==='admin'?true:false
		});
		return permission.save();
	}).then(result=>{
		if(result.length<=0)
			throw makeError('Permission not added');	
		req.flash('message','Registration done, please login now...');
		return res.redirect('/login');
	}).catch(err=>{
		console.log(err);
		req.flash('signuperror', err.message);
		res.redirect('/auth/signup');
	});
};

exports.getLogin = (req, res) => {
	res.render('auth/login', {title:'Login', error:req.flash('loginerror'), message:req.flash('message')});
};

exports.postLogin = (req, res, next) => {
	const { email, password } = req.body;
	User.findUser(email).then(result=>{
		if(result.length<=0)
			throw makeError("User doesn't exits", 404);
		let user = result[0];
		let passwordValid = bcryptjs.compareSync(password, user.password);
		if(!passwordValid)
			throw makeError('Invalid credentials', 442);
		req.session.logined = true;
		req.session.email = user.email;
		req.session.role = user.role;
		req.session.save();
		return res.redirect('/home');
	}).catch(err=>{
		console.log(err);
		req.flash('loginerror', err.message);
		res.redirect('/auth/login');
	});
};

exports.logout = (req, res) => {
	req.session.destroy();
	res.redirect('/auth/login');
};