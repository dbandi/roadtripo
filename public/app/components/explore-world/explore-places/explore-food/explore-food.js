app.controller('exploreFoodController', function($window, $compile, $rootScope, $scope, $http, $stateParams, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService, $timeout) {

    $scope.exploreFoodPlaceNameID = $stateParams.placename;
    $scope.exploreFoodCity = $stateParams.city;
    $scope.exploreFoodType = $stateParams.type;

    $scope.exploreFoodPlaceName = "";
    $scope.exploreFoodVideo = "";
    $scope.exploreFoodCityLat = "";
    $scope.exploreFoodCityLng = "";

    $scope.exploreFoodPlaceLists = [];

    $scope.playerVars = {
        controls: 0,
        autoplay: 1
    };

    dataService.getFoodDetails($scope.exploreFoodPlaceNameID).then(function (response) {
        $scope.exploreFoodVideo = response.data[0].food_video;
        $scope.exploreFoodPlaceName = response.data[0].food_name;
    });

    dataService.getCityLatLng($scope.exploreFoodCity).then(function (response) {
        $scope.exploreFoodCityLat = response.data[0].city_lat;
        $scope.exploreFoodCityLng = response.data[0].city_long;

        dataService.placeLocationDetails($scope.exploreFoodPlaceName, $scope.exploreFoodCityLat, $scope.exploreFoodCityLng, $scope.exploreFoodType).then(function (response) {
            $scope.exploreFoodPlaceLists = response.data.results;

            $scope.exploreFoodCityLat = response.data.results[0].geometry.location.lat;
            $scope.exploreFoodCityLng = response.data.results[0].geometry.location.lng;

            angular.forEach($scope.exploreFoodPlaceLists, function(value, key) {
                if(key < 11){
                    dataService.placeReviewsDetails(value.place_id).then(function (response) {
                        $scope.exploreFoodPlaceLists[key].reviews = response.data.result.reviews;
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
});
