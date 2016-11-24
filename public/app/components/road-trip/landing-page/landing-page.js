app.controller('startController', function($rootScope, $scope, $http, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService, $cacheFactory) {

    $scope.planTrip = function(){

        $scope.roadtrip.tripStart = $scope.source;
        $scope.roadtrip.tripEnd = $scope.destination;
        $scope.roadtrip.places = [];

        console.log($scope.source);
        console.log($scope.destination);

        $state.go('trip.explore');
    };

    $scope.mouseover = function(roatripIndex){
        console.log(roatripIndex);
        $scope.hoverActive = [];
        for (var i = 0; i < 3; i++) {
            if( (i+1) == roatripIndex){
                $scope.hoverActive.push('active');
            }
            else{
                $scope.hoverActive.push('notactive');
            }
        }
    };
});
