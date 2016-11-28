module.exports = function(app, passport, path, express, mysql, Yelp, rp, request, Promise, _) {

    var googleapikey = 'AIzaSyBll4kPCZuJIaBsvCv_gHCRTzk5-e-8WjM';
    var foursquareauth = 'MX12PJNE4ETCS2HTTXZLLUHUCQ5EBIHINKG0VJWHMYHJVQ1Z';

    /* =========== MySql Connection ============ */
    var connection = mysql.createConnection({
      multipleStatements: true,
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'roadtripo'
    });
    connection.connect();

    app.get('/getcities', function(req, res, next) {
        connection.query('SELECT * FROM cities', function(err, result) {
            if (!err){
                return res.send(result);
            }
            else{
                return res.sendStatus(400);
            }

        });
    });

    app.get('/citiesexplore', function(req, res, next) {
        var search = req.query.search;

        connection.query('SELECT * FROM food WHERE city_name_id = ?; SELECT * FROM adventure WHERE city_name_id = ?; SELECT * FROM attractions WHERE city_name_id = ?;', [search, search, search], function(err, result) {
            if (!err){
                return res.send(result);
            }
            else{
                return res.sendStatus(400);
            }

        });
    });

    app.get('/stateexplore', function(req, res, next) {
        var search = req.query.search;
        connection.query('SELECT * FROM trip WHERE trip_details LIKE ?', '%, ' + search + '%', function(err, result) {
            if (!err){
                return res.send(result);
            }
            else{
                return res.sendStatus(400);
            }

        });
    });

    app.get('/getfooddetails', function(req, res, next) {
        var food_name_id = req.query.food_name_id;
        connection.query('SELECT * FROM food WHERE food_name_id = ?', [food_name_id], function(err, result) {
            if (!err){
                return res.send(result);
            }
            else{
                return res.sendStatus(400);
            }

        });
    });

    // =====================================
	// Google Get Places ===================
	// =====================================
    app.get('/placeLocationDetails', function(req, res, next) {
        var placename = req.query.placename;
        var type = req.query.type;
        var lat = req.query.lat;
        var lng = req.query.lng;

        var placeDetails = {
            method: 'GET',
            uri: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius=10000&type='+type+'&keyword='+placename+'&key='+googleapikey,
            resolveWithFullResponse: true
        };

        rp(placeDetails)
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

    // =====================================
	// Google Get Reviews ==================
	// =====================================
    app.get('/placeReviewsDetails', function(req, res, next) {
        var placeid = req.query.placeid;

        var placeDetails = {
            method: 'GET',
            uri: 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+placeid+'&key='+googleapikey,
            resolveWithFullResponse: true
        };

        rp(placeDetails)
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

    // =====================================
	// Foursquare Place Detail ===================
	// =====================================
    app.get('/placeAttractionDetails', function(req, res, next) {
        var venue_id = req.query.venue_id;

        var placesNearby = {
            method: 'GET',
            uri: 'https://api.foursquare.com/v2/venues/'+venue_id+'?oauth_token='+foursquareauth+'&v=20161127',
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
};
