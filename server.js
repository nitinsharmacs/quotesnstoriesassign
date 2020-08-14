const express = require('express');
const app = express();
const path = require('path');

//third party libraries
const ejs = require('ejs');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const dbConnection = require('./util/dbConnection');

//routes
const authRoute = require('./routes/auth/auth');
const homeRoute = require('./routes/home/home');

//middlewares
const AuthMiddleware = require('./middlewares/auth');

//session config
let sessionStore = new MySqlStore({
	host:process.env.host,
	user:process.env.user,
	password:process.env.password,
	database:process.env.database
});
app.use(session({
	secret:'nitinsharmacs',
	store:sessionStore,
	saveUninitialized:false, 
	resave:false
}));


app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PETCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if(req.method == 'OPTIONS'){
		return res.sendStatus(200);
	}
	next()
})


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(flash())
//setting ejs template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth', authRoute);

app.use('/home', AuthMiddleware, homeRoute);

app.use('/', (req, res)=>{
	res.redirect('/auth/login');
});

// app.get('/login', (req, res)=>{
// 	res.render('Auth/login', {title:'Login', error:req.flash('loginerror'), message:req.flash('message')});
// });
// app.post('/login', (req, res)=>{
// 	if(!(req.body.email && req.body.password)){
// 		req.flash('loginerror','Bad Request');
// 		return res.redirect('/login');
// 	}
// 	const { email, password } = req.body;
// 	let role;
// 	db('users').select('*').where('email','=',email).then(result=>{
// 		if(result.length<=0)
// 			throw new Error("User doesn't exist");
// 		role = result[0].role;
// 		return bcrypt.compare(password, result[0].password);
// 	}).then(passwordMatch=>{
// 		if(!passwordMatch)
// 			throw new Error('Incorrect Password');
// 		req.session.logined = true;
// 		req.session.email = email;
// 		req.session.role = role;
// 		req.session.save();
// 		return res.redirect('/home');
// 	}).catch(err=>{
// 		console.log(err);
// 		req.flash('loginerror',err.message);
// 		return res.redirect('/login');
// 	});

// })
// app.get('/signup', (req, res)=>{
// 	res.render('Auth/signup', {title:'Register', error:req.flash('signuperror'), message:req.flash('message')});
// });
// app.post('/signup', (req, res)=>{
// 	if(!(req.body.email && req.body.password)){
// 		req.flash('signuperror','Bad Request');
// 		return res.redirect('/signup');
// 	}
// 	const { email, password, role } = req.body;
// 	db.select('email').from('users').where({
// 		email:email
// 	}).then(result=>{
// 		let passcode = bcrypt.hashSync(password, 12);
// 		console.log(result)
// 		if(result.length>0){
// 			console.log('INSIDE IF')
// 			return db('users').where({
// 				email:email
// 			}).update({
// 				role:role,
// 				password:passcode
// 			});
// 		}
// 		console.log('OUTSIDE iF')
// 		return db.insert({
// 			email:email,
// 			password:passcode,
// 			role:role
// 		}).into('users');
// 	}).then(result=>{
// 		console.log(result)
// 		if(result.length<=0)
// 			throw new Error('User not added');
// 		if(result===1)
// 			req.flash('message', 'Your status is changed to '+role);
// 		else
// 			req.flash('message','Regsiteration Done, Please login now :)');
// 		return res.redirect('/login');
// 	}).catch(err=>{
// 		console.log(err);
// 		req.flash('signuperror', err.message);
// 		return res.redirect('/signup');
// 	})

// });
// app.get('/home', (req, res)=>{
// 	if(!req.session.logined)
// 		return res.redirect('/login');
// 	console.log(req.session.role)
// 	res.render('Home/home', {title:'home', role:req.session.role});
// });

// app.get('/logout', (req, res)=>{
// 	req.session.destroy()
// 	return res.redirect('/login');
// })

// app.use('/', (req, res)=>{
// 	return res.redirect('/login');
// })

let port = process.env.PORT || 3001;


dbConnection.connect((db)=>{
	app.listen(port, ()=>{
		console.log(`App is running on ${port}`);
	});
});



