const User = require('../../modals/users/users');
const Permissions = require('../../modals/permissions/permissions');
const makeError = require('../../util/util').makeError;

exports.getHome = (req, res) => {
	Permissions.findPermissions(req.session.email).then(result=>{
		if(!result)
			throw makeError('Internal server error');
		if(result.length<=0)
			throw makeError('No Permission found', 404);
		let permissions = {
			accessGreenButton:result[0].accessGreenButton,
			accessRedButton:result[0].accessRedButton
		}
		console.log(permissions);
		return res.render('home/home', {title:'home', role:req.session.role, permissions:permissions});
	}).catch(err=>{
		console.log(err);
		return res.status(err.status||500).json({message:err.message, status:err.status||500});
	});
	
};

exports.getCustomers = (req, res) => {
	if(req.session.role!=='admin')
		return res.redirect('/home');
	User.getCustomers().then(result=>{
		if(!result)
			throw makeError('Customers not fetched');
		return res.render('customers/customers', {title:'Customers', customers:result});
	}).catch(err=>{
		console.log(err);
	});
};

exports.customerPermissions = (req, res) => {
	if(!req.body.email)
		return res.status(400).json({message:'Bad Request', status:400});
	Permissions.findPermissions(req.body.email).then(result=>{
		if(!result)
			throw makeError('Internal server error');
		if(result.length<=0)
			throw makeError('No Permission found', 404);
		return res.status(200).json({message:'Permissions found', data:result[0], status:200});
	}).catch(err=>{
		console.log(err);
		return res.status(err.status || 500).json({message:err.message, status:err.status||500});
	});
};

exports.updatePermissions = (req, res) => {
	let permissions = {
		accessGreenButton:req.body.accessgreenbtn?true:false,
		accessRedButton:req.body.accessredbtn?true:false
	}
	Permissions.updatePermission(req.body.email, permissions).then(result=>{
		return res.redirect('/home/customers');
	}).catch(err=>{
		return res.redirect('/home/customers');
	});
};