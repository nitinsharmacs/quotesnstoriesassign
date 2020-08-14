const knex = require('knex');

exports.db;

exports.connect = (cb) => {
 let database = knex({
	client:'mysql',
	connection:{
		host:process.env.host,
		user:process.env.user,
		password:process.env.password,
		database:process.env.database
	}
});
 exports.db = database;
 return cb(database);
}
