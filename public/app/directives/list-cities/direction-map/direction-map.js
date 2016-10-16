app.directive("directionMap", function(dataService, dataFactory, $timeout, ngDialog, NgMap) {

    function link($scope) {

        $scope.renderingOptions = {
            polylineOptions: {
            strokeColor: 'blue'
          }
        }

        NgMap.initMap('Map');
    }

    return {
        restrict: 'E',
        scope: {
            mapSource: '=',
            mapDestination: '='
        },
        templateUrl: "app/directives/list-cities/direction-map/direction-map.html",
        link: link
    };
});
