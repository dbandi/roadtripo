// app/plantrip.js
module.exports = function(app, passport, path, express, Yelp, rp, request, Promise, _) {

    var googleapikey = 'AIzaSyBll4kPCZuJIaBsvCv_gHCRTzk5-e-8WjM';
    var foursquareauth = 'MX12PJNE4ETCS2HTTXZLLUHUCQ5EBIHINKG0VJWHMYHJVQ1Z';
    var yelp = new Yelp({
        consumer_key: 'E8O3cJKY8nxFD_Z5lD7oZw',
        consumer_secret: 'XboQmv0xrpz0x904tBOdQTEO_dQ',
        token: 'wAJzxxEATBegum2Ugo0kXwaAcqXXZi5B',
        token_secret: 'eh7K2We4uUkn0KZ5vsOM76jh8l0',
    });

    var brandings = [];
    var directions = [];
    var totalDistance = 0;
    var totalMilesDistance = 0;
    var totalDuration = 0;
    var allCities = new Array();
    var allCitiesLatLng = {};
    var allCitiesKeyCount = 0;
    var allLatLong = {};

    // =====================================
	// Plantrip ===========================
	// =====================================
    app.get('/plantrip', function(req, res, next) {

        console.log(req.query.source);
        console.log(req.query.destination);
        request('https://maps.googleapis.com/maps/api/directions/json?origin='+req.query.source+'&destination='+req.query.destination+'&key='+googleapikey, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //directions = body; // Print the google web page.

                directions = JSON.parse( response.body );
                if(directions.status == "OK"){

                    totalDistance = directions.routes[0].legs[0].distance.value;
                    totalMilesDistance = totalDistance*0.000621371192;
                    totalDuration = directions.routes[0].legs[0].duration.value;
                    var totalSteps = directions.routes[0].legs[0].steps.length;

                    for (var m=0; m < totalSteps - 1; m++) {
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
                            uri: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + allLatLong[i].lat + ' , ' + allLatLong[i].lng + '&sensor=false&key='+googleapikey,
                            resolveWithFullResponse: true    //  <---  <---  <---  <---
                        };

                        rp(city_options)
                            .then(function (gresponse) {
                                temp++;
                                if (gresponse.statusCode == 200) {
                                    results = JSON.parse( gresponse.body );

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

    // =====================================
	// Places ===========================
	// =====================================
    app.get('/places', function(req, res, next) {

        var placetypes = req.query.placetypes;
        var lat = req.query.lat;
        var lng = req.query.lng;
        var placesNearby = {
            method: 'GET',
            uri: 'https://api.foursquare.com/v2/venues/explore?ll='+lat+','+lng+'&oauth_token='+foursquareauth+'&v=20160921&venuePhotos=1&query=Popular+with+Visitors',
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

    // =====================================
	// Place Filter ===========================
	// =====================================
    app.get('/placefilter', function(req, res, next) {
        var placetypes = req.query.placetypes;
        var lat = req.query.lat;
        var lng = req.query.lng;

        yelp.search({ term: placetypes, ll: lat+','+lng })
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
          console.error(err);
        });
    });

    // =====================================
	// Photos ===========================
	// =====================================
    app.get('/photos', function(req, res, next) {
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

};
