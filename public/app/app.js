var app = angular.module('roadtripo',['ngAutocomplete','ngMap']);

app.controller('myController',['$scope', '$http', 'dataService', 'dataFactory', 'NgMap', function($scope, $http, dataService, dataFactory, NgMap) {

    NgMap.getMap({id:'contactmap'}).then(function(map) {
      map.setZoom(4);
      console.log('done');
    });

    $scope.cities = [];
    $scope.places = [];
    $scope.allPlaces = [];
    $scope.trip = [];

    $scope.source = "";
    $scope.destination = "";

    $scope.homePage = true;
    $scope.listCities = false;

    $scope.plantrip = function(){
        $scope.homePage = false;
        $scope.listCities = true;

        var source = $scope.source.replace(/ /g, '+');;
        var destination = $scope.destination.replace(/ /g, '+');

        dataService.getCities(source, destination).then(function (response) {
            $scope.cities = response.data;

            var citiesLength = Object.keys($scope.cities).length;
            console.log($scope.cities);
            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;
                var placetypes = 'Popular+with+Visitors';

                dataService.getPlaces(placetypes, $scope.cities[i].lat, $scope.cities[i].lng).then(function (response) {
                    for (var j = 0; j < response.data.response.groups[0].items.length; j++) {
                        var responseData = response.data.response.groups[0].items[j].venue;
                        var placesModel = dataFactory.getFoursquareAPIplacesModel(responseData);
                        $scope.places.push(placesModel);
                    }
                });
            }
        });

    }


}]);
