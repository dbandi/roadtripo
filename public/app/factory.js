app.factory('dataFactory', function () {
    var APIplacesModel = {};

    function getFoursquareAPIplacesModel(responseData) {
        APIplacesModel = {};
        APIplacesModel.placeid = responseData.id;
        APIplacesModel.placename = responseData.name;
        APIplacesModel.address = responseData.location.formattedAddress.join();
        APIplacesModel.lat = parseFloat(responseData.location.lat);
        APIplacesModel.lng = parseFloat(responseData.location.lng);
        APIplacesModel.city = responseData.location.city;
        APIplacesModel.photo = responseData.photos.groups[0].items[0].prefix + '365x205' + responseData.photos.groups[0].items[0].suffix;
        APIplacesModel.placetype = responseData.categories[0].shortName;
        return APIplacesModel;
    }

    function getYelpAPIplacesModel(responseData) {
        APIplacesModel = {};
        APIplacesModel.placeid = responseData.id;
        APIplacesModel.placename = responseData.name;
        APIplacesModel.address = responseData.id;
        APIplacesModel.lat = parseFloat(responseData.location.coordinate.latitude);
        APIplacesModel.lng = parseFloat(responseData.location.coordinate.longitude);
        APIplacesModel.city = responseData.location.city;

        var largePhoto = responseData.image_url.split('/');
        largePhoto.pop();
        largePhoto = largePhoto.join('/');
        largePhoto = largePhoto + '/l.jpg';

        APIplacesModel.photo = largePhoto;
        APIplacesModel.placetype = responseData.categories[responseData.categories.length - 1][0];
        return APIplacesModel;
    }

    return {
        getFoursquareAPIplacesModel : getFoursquareAPIplacesModel,
        getYelpAPIplacesModel : getYelpAPIplacesModel
    }
});
