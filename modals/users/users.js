const database = require('../../util/dbConnection');

class User {
	constructor(user){
		this.user = {
			email:user.email,
			password:user.password,
			role:user.role
		}
	}
	save(){
		return database.db.insert(this.user).into('users');
	}
	// find user by user email
	static findUser(email){
		return database.db.select('*').from('users').where({email:email});
	}
	// get all customers
	static getCustomers(){
		return database.db.select('email').from('users').where({role:'customer'});
	}
}

module.exports = User;