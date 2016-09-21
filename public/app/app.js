var app = angular.module('roadtripo',[]);

app.controller('myController',['$scope', '$http', 'dataService', function($scope, $http, dataService) {
    $scope.data = [];

    dataService.getCities().then(function (response) {
        console.log(response.data);
        $scope.data = response.data;
    });

    $scope.getPlacesofCities = function(placetypes, lat, lng){
        if(placetypes == ''){
            placetypes = ['amusement_park', 'art_gallery', 'zoo', 'park'];
        }

        dataService.getPlaces(placetypes, lat, lng).then(function (response) {
            console.log(response.data);
            $scope.places = response.data;
        });
    };
}]);
