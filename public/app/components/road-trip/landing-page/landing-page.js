app.controller('startController', function($scope, $http, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService) {

    $scope.plantrip = function(){

        $scope.roadtrip.tripStart = $scope.source;
        $scope.roadtrip.tripEnd = $scope.destination;

        var source = $scope.source.replace(/ /g, '+');
        var destination = $scope.destination.replace(/ /g, '+');

        dataService.getCities(source, destination).then(function (response) {
            $scope.cities = response.data;

            var citiesLength = Object.keys($scope.cities).length;
            for (var i = 0; i < citiesLength; i++) {
                var placetypes = 'Popular+with+Visitors';

                dataService.getPlaces(placetypes, $scope.cities[i].lat, $scope.cities[i].lng).then(function (response) {
                    for (var j = 0; j < response.data.response.groups[0].items.length; j++) {
                        var responseData = response.data.response.groups[0].items[j].venue;
                        var placesModel = dataFactory.getFoursquareAPIplacesModel(responseData);
                        $scope.places.push(placesModel);
                        $scope.roadtrip.places = $scope.places;
                        $scope.roadtrip.cities = $scope.cities;
                    }
                });
            }
        });

        $state.go('trip.explore');
    };
});
