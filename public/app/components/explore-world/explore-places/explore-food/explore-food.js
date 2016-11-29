app.controller('exploreFoodController', function($window, $compile, $rootScope, $scope, $http, $stateParams, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService, $timeout) {

    $scope.exploreFoodPlaceNameID = $stateParams.placename;
    $scope.exploreFoodCity = $stateParams.city;
    $scope.exploreFoodType = $stateParams.type;

    $scope.exploreFoodImage = '../../../images/food/' + $stateParams.placename + '.jpg';

    $scope.exploreFoodPlaceName = "";
    $scope.exploreFoodVideo = "";
    $scope.exploreFoodCityLat = "";
    $scope.exploreFoodCityLng = "";

    $scope.foodPlaceTitle = "";
    $scope.foodPlaceVicinity = "";
    $scope.foodPlaceRating = 0;
    $scope.foodPlaceImage = "";
    $scope.foodPlaceOpenNow = "";
    $scope.foodPlaceReviews = [];

    $scope.playIcon = true;
    $scope.videos = [{
        videoId: '',
        mute: true
    }];

    $scope.exploreFoodPlaceLists = [];

    $scope.callback = function(player){
        $scope.playIcon = false;
        $timeout(function() {
            $scope.exploreFoodImage = '';
        }, 1000);
    };

    dataService.getFoodDetails($scope.exploreFoodPlaceNameID).then(function (response) {
        $scope.exploreFoodVideo = response.data[0].food_video;
        $scope.exploreFoodPlaceName = response.data[0].food_name;

        $scope.videos = [{
            videoId: response.data[0].food_video,
            mute: true
        }];
    });

    dataService.getCityLatLng($scope.exploreFoodCity).then(function (response) {
        $scope.exploreFoodCityLat = response.data[0].city_lat;
        $scope.exploreFoodCityLng = response.data[0].city_long;

        dataService.placeLocationDetails($scope.exploreFoodPlaceName, $scope.exploreFoodCityLat, $scope.exploreFoodCityLng, $scope.exploreFoodType).then(function (response) {
            $scope.exploreFoodPlaceLists = response.data.results;

            $scope.exploreFoodCityLat = response.data.results[0].geometry.location.lat;
            $scope.exploreFoodCityLng = response.data.results[0].geometry.location.lng;

            $scope.foodPlaceTitle = response.data.results[0].name;
            $scope.foodPlaceVicinity = response.data.results[0].vicinity;
            $scope.foodPlaceRating = response.data.results[0].rating;
            $scope.foodPlaceImage = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + response.data.results[0].photos[0].photo_reference + '&key=AIzaSyBll4kPCZuJIaBsvCv_gHCRTzk5-e-8WjM';
            $scope.foodPlaceOpenNow = response.data.results[0].opening_hours.open_now;

            angular.forEach($scope.exploreFoodPlaceLists, function(value, key) {
                if(key < 11){
                    dataService.placeReviewsDetails(value.place_id).then(function (response) {
                        $scope.exploreFoodPlaceLists[key].reviews = response.data.result.reviews;
                        $scope.foodPlaceReviews = $scope.exploreFoodPlaceLists[0].reviews;
                    });
                }
            });

        });
    });

    $scope.getNumber = function(num) {
        if(typeof num !== "undefined")
        {
            return new Array(parseInt(num));
        }
    }

    $scope.isDecimal = function(num) {
        if(num % 1 != 0){
            return true;
        }
        else{
            return false;
        }
    }

    $scope.setMapLocation = function(lat, lng){
        $scope.exploreFoodCityLat = lat;
        $scope.exploreFoodCityLng = lng;
    };

    $scope.updateFoodPlace = function(foodPlace){
        $scope.exploreFoodCityLat = foodPlace.geometry.location.lat
        $scope.exploreFoodCityLng = foodPlace.geometry.location.lng;

        $scope.foodPlaceTitle = foodPlace.name;
        $scope.foodPlaceVicinity = foodPlace.vicinity;
        $scope.foodPlaceRating = foodPlace.rating;
        $scope.foodPlaceImage = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + foodPlace.photos[0].photo_reference + '&key=AIzaSyBll4kPCZuJIaBsvCv_gHCRTzk5-e-8WjM';
        $scope.foodPlaceOpenNow = foodPlace.opening_hours.open_now;
    }
});
