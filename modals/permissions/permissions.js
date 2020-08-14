const database = require('../../util/dbConnection');

class Permissions {
	constructor(permission){
		this.permission = {
			email:permission.email,
			accessRedButton:permission.accessRedButton
		}
	}
	save(){
		return database.db.insert(this.permission).into('permissions');
	}
	// find Permissions by user email
	static findPermissions(email){
		return database.db.select('*').from('permissions').where({email:email});
	}
	// updating the permissions of the customer
	static updatePermission(email, permissions){
		return database.db('permissions').where({email:email}).update({accessGreenButton:permissions.accessGreenButton, accessRedButton:permissions.accessRedButton});
	}
}

module.exports = Permissions;