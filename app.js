var express = require('express');
var session  = require('express-session');
var path = require('path');
var _ = require('underscore-node');
var rp = require('request-promise');
var request = require('request');
var Promise = require("bluebird");
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GooglePlusStrategy = require('passport-google-plus');
var mysql = require('mysql');
var mysqlModel = require('mysql-model');
var bcrypt = require('bcrypt-nodejs');
var consolidate = require('consolidate');
var Yelp = require('yelp');
var Bing = require('node-bing-api')({ accKey: "LPclYNGuvOM0WbzhCJ9QGoUgaRR/fIt2OyGn+k1AxIo" });
var NodeGeocoder = require('node-geocoder');
var airbnb = require('airapi');

//var routes = require('./routes/route');
var app = express();
var port = process.env.PORT || 3000;

require('./config/passport')(passport);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', consolidate.swig);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view cache', false);

//app.use(express.static(__dirname + '/public'));

// required for passport
app.use(session({
	secret: 'roadtripoplanner',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes ======================================================================
require('./app/auth.js')(app, passport, path, express, cookieParser, cookieSession, bodyParser, FacebookStrategy, GooglePlusStrategy, TwitterStrategy);
require('./app/plantrip.js')(app, passport, path, express, NodeGeocoder, airbnb, Yelp, Bing, rp, request, Promise, _);
require('./app/trip.js')(app, passport, path, express, mysql, Yelp, rp, request, Promise, _);

module.exports = app;

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
