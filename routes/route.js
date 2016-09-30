var express = require('express');
var router = express.Router();

var User = require('../models/user');
var path = require('path');
var _ = require('underscore-node');
var rp = require('request-promise');
var request = require('request');
var Promise = require("bluebird");
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var mysql = require('mysql');
var mysqlModel = require('mysql-model');

/* =========== MySql Connection ============ */
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'roadtripo'
});

/*connection.connect();
connection.query('SELECT * from users', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});
connection.end();*/

/* =========== End of MySql connection ============ */

/* =========== Passport Facebook =========== */

passport.use(new FacebookStrategy({
    clientID: '1576754455964708',
    clientSecret: 'e105dad8a885bffc1e7d48f4064aeb2a',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      User.findOrCreate(profile, function(err, user) {
          if (err) { return done(err); }
          return done();
      });
  }
));

/* =========== End of Passport Facebook =========== */

var brandings = [];
var directions = [];
var totalDistance = 0;
var totalMilesDistance = 0;
var totalDuration = 0;
var allCities = new Array();
var allCitiesLatLng = {};
var allCitiesKeyCount = 0;
var allLatLong = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/auth/facebook',
  passport.authenticate('facebook'));

  var options = {
      successRedirect: '/plantrip',
      failureRedirect: '/bummer-dude'
  };
  router.get('/auth/facebook/callback', passport.authenticate('facebook', options));

router.get('/plantrip', function(req, res, next) {

    var request = require('request');
    request('https://maps.googleapis.com/maps/api/directions/json?origin=Chicago&destination=Los+Angeles&key=AIzaSyBll4kPCZuJIaBsvCv_gHCRTzk5-e-8WjM', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //directions = body; // Print the google web page.

            directions = JSON.parse( response.body );
            if(directions.status == "OK"){

                totalDistance = directions.routes[0].legs[0].distance.value;
                totalMilesDistance = totalDistance*0.000621371192;
                totalDuration = directions.routes[0].legs[0].duration.value;

                console.log(totalDistance);
                console.log(totalMilesDistance);
                console.log(totalDuration);

                /*res.send(JSON.stringify(directions.routes[0].legs[0].steps));*/

                var totalSteps = directions.routes[0].legs[0].steps.length;

                /* (lenght-1) since 1st legs [steps] does not have end location */

                for (var m=0; m < totalSteps - 1; m++) {

                  /* All Intermediate Route Locations */
                  allLatLong[m] = {
                        lat : directions.routes[0].legs[0].steps[m].end_location.lat,
                        lng : directions.routes[0].legs[0].steps[m].end_location.lng
                    }
                }

                var allCitiesLength = Object.keys(allLatLong).length;

                for (var i=0; i < allCitiesLength; i++){

                    var temp=0;
                    var city_options = {
                        method: 'GET',
                        uri: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + allLatLong[i].lat + ' , ' + allLatLong[i].lng + '&sensor=false&key=AIzaSyBll4kPCZuJIaBsvCv_gHCRTzk5-e-8WjM',
                        resolveWithFullResponse: true    //  <---  <---  <---  <---
                    };

                    rp(city_options)
                        .then(function (gresponse) {
                            temp++;
                            if (gresponse.statusCode == 200) {
                                results = JSON.parse( gresponse.body );
                                //console.log(results);

                                /* Different set of address_components */
                                for (var j = 0; j < results.results.length; j++) {

                                    for (var k = 0; k < results.results[j].address_components.length; k++) {
                                        if(results.results[j].address_components[k].types.indexOf('locality') > -1){
                                            //console.log(results.results[j].address_components[k].long_name);
                                            //allCities.push(results.results[j].address_components[k].long_name);
                                            if(!(_.contains(allCities, results.results[j].address_components[k].long_name))){
                                                allCities.push(results.results[j].address_components[k].long_name);
                                                allCitiesLatLng[allCitiesKeyCount] = {
                                                    city : results.results[j].address_components[k].long_name,
                                                    lat : results.results[j].geometry.location.lat,
                                                    lng : results.results[j].geometry.location.lng,
                                                    placeId : results.results[j].place_id
                                                }
                                                allCitiesKeyCount++;
                                            }
                                        }
                                    }
                                }

                                if( temp == allCitiesLength){
                                    res.json(allCitiesLatLng);
                                }
                            }
                        })
                        .catch(function (err) {
                            console.log(err);
                    });
                }
            }
         }
    });
});


router.get('/places', function(req, res, next) {

    var placetypes = req.query.placetypes;
    var lat = req.query.lat;
    var lng = req.query.lng;

    var placesNearby = {
        method: 'GET',
        uri: 'https://api.foursquare.com/v2/venues/explore?ll='+lat+','+lng+'&oauth_token=MX12PJNE4ETCS2HTTXZLLUHUCQ5EBIHINKG0VJWHMYHJVQ1Z&v=20160921&venuePhotos=1&query=Popular+with+Visitors',
        resolveWithFullResponse: true
    };

    rp(placesNearby)
        .then(function (response) {
            if (response.statusCode == 200) {
                results = JSON.parse( response.body );
                res.json(results);
            }
        })
        .catch(function (err) {
            console.log(err);
    });

});

router.get('/photos', function(req, res, next) {
    var placeName = req.query.placeName;

    var placesNearby = {
        method: 'GET',
        uri: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6f879817c92af79cc71ad4f6db8d45c8&text=Millennium+Park%2C+Chicago&per_page=1&format=json&nojsoncallback=1&api_sig=ecbac332b0249bfd73d35b268007b374',
        resolveWithFullResponse: true
    };

    rp(placesNearby)
        .then(function (response) {
            if (response.statusCode == 200) {
                results = JSON.parse( response.body );
                res.json(results);
            }
        })
        .catch(function (err) {
            console.log(err);
    });
});



module.exports = router;
