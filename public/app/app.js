var app = angular.module('roadtripo',[]);

app.controller('myController',['$scope', '$http', 'dataService', function($scope, $http, dataService) {
    $scope.cities = [];
    $scope.places = [];
    $scope.listCities = false;
    $scope.listPlaces = false;

    dataService.getCities().then(function (response) {
        $scope.listCities = true;
        $scope.listPlaces = false;
        $scope.cities = response.data;
    });

    $scope.getPlacesofCities = function(placetypes, lat, lng){
        if(placetypes == ''){
            placetypes = ['amusement_park', 'art_gallery', 'zoo', 'park'];
        }

        dataService.getPlaces(placetypes, lat, lng).then(function (response) {
            $scope.listPlaces = true;
            $scope.listCities = false;
            console.log(response.data.response.groups[0].items);
            $scope.places = response.data.response.groups[0].items;
        });
    };
}]);
