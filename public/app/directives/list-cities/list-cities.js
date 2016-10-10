app.directive("listCities", function(dataService, dataFactory, $timeout, ngDialog) {

    function link($scope) {

        $scope.listCities = true;
        $scope.sourceCity = $scope.source.split(',')[0];
        $scope.destinationCity = $scope.destination.split(',')[0];

        ngDialog.open({ template: 'app/modals/login.html', className: 'ngdialog-theme-default' });

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
                        console.log(responseData);
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
                if(response.data == "403"){

                }
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
