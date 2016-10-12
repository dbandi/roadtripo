app.directive("myTrips", function(dataService, dataFactory, $timeout, ngDialog) {

    function link($scope) {

        $scope.alltrips = $scope.mytrips;

        $scope.viewPlaces = function(){
            $scope.$emit('viewPlaces');
        }

        $scope.viewTrip = function(){
            $scope.$emit('viewTrip');
        }
    }

    return {
        restrict: 'E',
        scope: {
            mytrips: '=',
            userId: '='
        },
        templateUrl: "app/directives/my-trips/my-trips.html",
        link: link
    };
});
