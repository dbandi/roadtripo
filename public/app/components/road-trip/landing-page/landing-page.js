app.controller('startController', function($location, $window, $rootScope, $scope, $http, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService, $cacheFactory) {

    $scope.planTrip = function(){

        $scope.roadtrip.tripStart = $scope.source;
        $scope.roadtrip.tripEnd = $scope.destination;
        $scope.roadtrip.places = [];

        $state.go('trip.explore');
    };

    $scope.mouseover = function(roatripIndex){
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

    $scope.exploreCities = [];
    dataService.getCities().then(function (response) {
        var citiesList = response.data;

        angular.forEach(citiesList, function(value, key) {
            var newCity = {
                cityId: value.city_id,
                cityName: value.city_name,
                cityNameId: value.city_name_id,
                cityImage: value.city_image
            }

            $scope.exploreCities.push(newCity);

        });
    });

    /*$scope.viewCityVideos = function(city_id){
        $state.go('trip.cities', {'search': city_id}, {reload: true});
        //window.open('#/trip/videos/' + city_id);
    }*/
});
