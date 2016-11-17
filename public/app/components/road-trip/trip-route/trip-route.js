app.controller('tripRouteController', function($scope, $http, dataService, dataFactory, NgMap, ngDialog, $animate, $state, $stateParams, localStorageService) {
    var tripId = $stateParams.routeID;

    $scope.mapWayPoints = [];
    $scope.isEdit = false;

    dataService.getTripRoute(tripId).then(function (response) {
        $scope.mapCenter = response.data[0].trip_end;
        $scope.tripRoute = JSON.parse(response.data[0].trip_details);

        $scope.mapOrigin = response.data[0].trip_start;
        $scope.mapDestination = response.data[0].trip_end;

        for (var i = 0; i < $scope.tripRoute.length; i++) {
            var waypoint_location = {
                lat : $scope.tripRoute[i].lat,
                lng : $scope.tripRoute[i].lng
            }

            $scope.mapWayPoints.push({
                location : waypoint_location,
                stopover : true
            });
        }
    });

    $scope.editTrip = function(tripRoute){
        $scope.tripId = tripId;
        $scope.isEdit = true;
    };

    $scope.removePitstop = function(pitstopIndex){
        $scope.tripRoute.splice(pitstopIndex, 1);
    };

    $scope.deleteTrip = function(tripRoute){
        console.log(tripRoute);
        ngDialog.open({ template: 'app/modals/delete.html', className: 'ngdialog-theme-default', scope: $scope });
    };

    $scope.confirmDeleteTrip = function(){
        dataService.deleteTrip(tripId).then(function (response) {
            dataService.getTrips().then(function(response){
                $scope.mytrips = response.data;
                ngDialog.close();
                $scope.$emit('viewUserTrips');
            });
        });
    }

    $scope.updateTrip = function(){
        dataService.getTrips().then(function(response){
            $scope.mytrips = response.data;

            angular.forEach($scope.mytrips, function(value, key) {
                if(value.trip_id == tripId){
                    $scope.mytrips[key].trip_details = JSON.stringify($scope.tripRoute);
                    dataService.updateTrip(tripId, $scope.mytrips[key]).then(function (response) {
                        console.log(response.data);
                    });
                }
            });

            $scope.isEdit = false;
        });
    };

    $scope.addPlaces = function(){
        dataService.getTripRoute(tripId).then(function (response) {

            $scope.tripId = tripId;
            $scope.roadtrip.tripStart = response.data[0].trip_start;
            $scope.roadtrip.tripEnd =  response.data[0].trip_end;

            var source = $scope.roadtrip.tripStart.replace(/ /g, '+');
            var destination = $scope.roadtrip.tripEnd.replace(/ /g, '+');

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
        });

    };

});
