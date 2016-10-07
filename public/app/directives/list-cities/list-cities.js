app.directive("listCities", function(dataService, dataFactory, $timeout) {

    function link($scope) {

        $scope.listCities = true;
        /*$timeout(function() {
            google.maps.event.trigger(map, "resize");
        });*/
        $scope.getYelpPlacesofCities = function(placetypes){
            $scope.listCities = true;

            //Reset PLaces
            $scope.places = [];
            var citiesLength = Object.keys($scope.cities).length;

            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;
                dataService.getPlacesFilter(placetypes, $scope.cities[i].lat, $scope.cities[i].lng).then(function (response) {
                    for (var j = 0; j < response.data.businesses.length; j++) {
                        var responseData = response.data.businesses[j];
                        var placesModel = dataFactory.getYelpAPIplacesModel(responseData);
                        $scope.places.push(placesModel);
                    }
                });
            }
        };

        $scope.addToTrip = function(place){
            $scope.trip.push(place);
        };

        $scope.saveTrip = function(){
            var trip = dataFactory.getTrip($scope.source, $scope.destination, $scope.trip);
            dataService.saveTrip(trip).then(function (response) {

            });
        };
    }

    return {
        restrict: 'E',
        scope: {
            cities: '=',
            places: '=',
            trip: '=',
            source: '=',
            destination: '='
        },
        templateUrl: "app/directives/list-cities/list-cities.html",
        link: link
    };
});
