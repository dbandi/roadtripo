app.controller('exploreAttractionsController', function($window, $compile, $rootScope, $scope, $http, $stateParams, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService, $timeout) {

    $scope.exploreAttractionsPlaceNameID = $stateParams.placename;
    $scope.exploreAttractionsCity = $stateParams.city;
    $scope.exploreAttractionsType = $stateParams.type;

    $scope.exploreAttractionsPlaceName = "";
    $scope.exploreAttractionsVideo = "";
    $scope.exploreAttractionsCityLat = "";
    $scope.exploreAttractionsCityLng = "";

    $scope.exploreAttractionsPlaceLists = [];

    $scope.playerVars = {
        controls: 0,
        autoplay: 1
    };

    dataService.getAttractionsDetails($scope.exploreAttractionsPlaceNameID).then(function (response) {
        $scope.exploreAttractionsVideo = response.data[0].attractions_video;
        $scope.exploreAttractionsPlaceName = response.data[0].attractions_name;
    });

    dataService.getCityLatLng($scope.exploreAttractionsCity).then(function (response) {
        $scope.exploreAttractionsCityLat = response.data[0].city_lat;
        $scope.exploreAttractionsCityLng = response.data[0].city_long;

        dataService.placeAttractionsDetails($scope.exploreAttractionsPlaceNameID).then(function (response) {
            console.log(response);
        });
    });

});
