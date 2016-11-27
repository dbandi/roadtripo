app.controller('detailsController', function($window, $compile, $rootScope, $scope, $http, $stateParams, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService, $timeout) {

    $scope.detailsPlaceNameID = $stateParams.placename;
    $scope.detailsCity = $stateParams.city;
    $scope.detailsType = $stateParams.type;

    $scope.detailsPlaceName = "";
    $scope.detailVideo = "";
    $scope.detailsCityLat = "";
    $scope.detailsCityLng = "";

    $scope.detailsPlaceLists = [];

    $scope.playerVars = {
        controls: 0,
        autoplay: 1
    };

    dataService.getFoodDetails($scope.detailsPlaceNameID).then(function (response) {
        $scope.detailVideo = response.data[0].food_video;
        $scope.detailsPlaceName = response.data[0].food_name;
    });

    dataService.getCityLatLng($scope.detailsCity).then(function (response) {
        $scope.detailsCityLat = response.data[0].city_lat;
        $scope.detailsCityLng = response.data[0].city_long;

        dataService.placeLocationDetails($scope.detailsPlaceName, $scope.detailsCityLat, $scope.detailsCityLng, $scope.detailsType).then(function (response) {
            $scope.detailsPlaceLists = response.data.results;
            console.log(response.data.results);

            angular.forEach($scope.detailsPlaceLists, function(value, key) {
                if(key < 11){
                    dataService.placeReviewsDetails(value.place_id).then(function (response) {
                        console.log(response.data);
                        $scope.detailsPlaceLists[key].reviews = response.data.result.reviews;
                    });
                }
            });

        });
    });

});
