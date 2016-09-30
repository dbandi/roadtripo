app.directive("listCities", function(dataService) {

    function link($scope) {

        $scope.listCities = false;

        $scope.getPlacesofCities = function(placetypes, lat, lng){
            $scope.listPlaces = true;
            $scope.listCities = true;

            dataService.getPlaces(placetypes, lat, lng).then(function (response) {
                $scope.places = response.data.response.groups[0].items;
            });
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
