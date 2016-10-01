app.directive("listCities", function(dataService,$timeout) {

    function link($scope) {

        $scope.listCities = true;
        /*$timeout(function() {
            google.maps.event.trigger(map, "resize");
        });*/
        $scope.getPlacesofCities = function(placetypes){
            $scope.listCities = true;

            //Reset PLaces
            $scope.places = [];
            var citiesLength = Object.keys($scope.cities).length;

            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;

                dataService.getPlacesFilter(placetypes, $scope.cities[i].lat, $scope.cities[i].lng).then(function (response) {
                    //$scope.places.push(response.data.response.venue);
                    console.log(response.data.response.venue);
                });
            }

            //console.log($scope.places);
        };
    }

    return {
        restrict: 'E',
        scope: {
            cities: '=',
            places: '='
        },
        templateUrl: "app/directives/list-cities/list-cities.html",
        link: link
    };
});
