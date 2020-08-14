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



let port = process.env.PORT || 3001;


dbConnection.connect((db)=>{
	app.listen(port, ()=>{
		console.log(`App is running on ${port}`);
	});
});



