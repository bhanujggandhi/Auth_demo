var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	User = require('./models/user'),
	localStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	require('express-session')({
		secret: 'Bhanuj is the king',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========================
// ROUTES
//========================

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/secret', function(req, res) {
	res.render('secret');
});

// AUTH ROUTE

//Show sign up page
app.get('/register', function(req, res) {
	res.render('register');
});

// handling user sign up
app.post('/register', function(req, res) {
	req.body.username;
	req.body.password;
	User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/secret');
		});
	});
});

// LOGIN ROUTE
// render log in form
app.get('/login', function(req, res) {
	res.render('login');
});

// Login logic
// middleware
app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/secret',
		failureRedirect: '/login'
	}),
	function(req, res) {}
);

app.listen(3000, function() {
	console.log('Server started');
});
