app.factory('dataFactory', function () {
    var APIplacesModel = {};

    function getFoursquareAPIplacesModel(responseData) {
        APIplacesModel = {};
        APIplacesModel.placeid = responseData.id;
        APIplacesModel.placeAPI = 'Foursquare';
        APIplacesModel.placename = responseData.name;
        APIplacesModel.address = responseData.location.formattedAddress.join();
        APIplacesModel.lat = parseFloat(responseData.location.lat);
        APIplacesModel.lng = parseFloat(responseData.location.lng);
        APIplacesModel.city = responseData.location.city;
        APIplacesModel.rating = responseData.rating;
        APIplacesModel.photo = responseData.photos.groups[0].items[0].prefix + '365x365' + responseData.photos.groups[0].items[0].suffix;
        APIplacesModel.placetype = responseData.categories[0].shortName;
        return APIplacesModel;
    }

    function getYelpAPIplacesModel(responseData) {
        APIplacesModel = {};
        APIplacesModel.placeid = responseData.id;
        APIplacesModel.placeAPI = 'Yelp';
        APIplacesModel.placename = responseData.name;
        APIplacesModel.address = responseData.id;
        APIplacesModel.lat = parseFloat(responseData.location.coordinate.latitude);
        APIplacesModel.lng = parseFloat(responseData.location.coordinate.longitude);
        APIplacesModel.city = responseData.location.city;

        var largePhoto = responseData.image_url.split('/');
        largePhoto.pop();
        largePhoto = largePhoto.join('/');
        largePhoto = largePhoto + '/l.jpg';

        APIplacesModel.rating = responseData.rating;
        APIplacesModel.photo = largePhoto;
        APIplacesModel.placetype = responseData.categories[responseData.categories.length - 1][0];
        return APIplacesModel;
    }

    function getTrip(source, destination, trip, tripId) {
        APItripModel = {};
        APItripModel.user_id = 1;
        var trip_name = "Trip";

        if (source.indexOf(',') > -1) {
             trip_name = source.split(',')[0];
        }

        if (destination.indexOf(',') > -1) {
             trip_name = trip_name + " - " + destination.split(',')[0];
         }

        APItripModel.trip_id = tripId;
        APItripModel.trip_name = trip_name;
        APItripModel.trip_start = source;
        APItripModel.trip_end = destination;
        APItripModel.trip_details = trip;
        return APItripModel;
    }

    return {
        getFoursquareAPIplacesModel : getFoursquareAPIplacesModel,
        getYelpAPIplacesModel : getYelpAPIplacesModel,
        getTrip : getTrip
    }
});
