var app = angular.module('roadtripo',['ngAutocomplete']);

app.controller('myController',['$scope', '$http', 'dataService', function($scope, $http, dataService) {
    $scope.cities = [];
    $scope.places = [];
    $scope.allPlaces = [];

    $scope.source = "";
    $scope.destination = "";
    $scope.autocomplete = "";

    $scope.homePage = true;
    $scope.listCities = false;
    $scope.listPlaces = false;

    $scope.plantrip = function(){
        $scope.homePage = false;
        $scope.listCities = false;
        $scope.listPlaces = true;
        var source = $scope.source;
        var destination = $scope.destination;
        console.log(source);
        dataService.getCities(source, destination).then(function (response) {
            $scope.cities = response.data;

            var citiesLength = Object.keys($scope.cities).length;
            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;
                var placetypes = '';

                dataService.getPlaces(placetypes, $scope.cities[i].lat, $scope.cities[i].lng).then(function (response) {
                    $scope.places.push(response.data.response.groups[0].items);
                    console.log($scope.places);
                });
            }
        });
    }


}]);
