var express = require('express');
var session  = require('express-session');
var path = require('path');
var _ = require('underscore-node');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var mysql = require('mysql');
var mysqlModel = require('mysql-model');
var bcrypt = require('bcrypt-nodejs');
var routes = require('./routes/route');

var app = express();

require('./config/passport')(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({
	secret: 'roadtripoplanner',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);
app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/views/login.html');
});
app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/views/signup.html');
});

// show the login form
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/views/login.html');
});

// process the login form
app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
          console.log("Success");
        } else {
          req.session.cookie.expires = false;
        }
    res.redirect('/');
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
