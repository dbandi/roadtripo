app.directive("tripDetails", function(dataService, dataFactory, $timeout, ngDialog, NgMap, $animate) {

    function link($scope) {

        $scope.mapWayPoints = [];
        $scope.tripRouteDetails = [];

        $scope.mapPitstopImage = "";
        $scope.mapPitstopName = "Chicago";
        $scope.mapPitstopAddress = "Naperville";

        $scope.tripRouteDetails = JSON.parse($scope.tripRoute.trip_details);        
        $scope.mapOrigin = $scope.tripRoute.trip_start;
        $scope.mapDestination = $scope.tripRoute.trip_end;
        var trip_waypoints = JSON.parse($scope.tripRoute.trip_details);
        for (var j = 0; j < trip_waypoints.length; j++) {
            var waypoint_location = {
                lat : trip_waypoints[j].lat,
                lng : trip_waypoints[j].lng
            }

            $scope.mapWayPoints.push({
                location : waypoint_location,
                stopover : true
            });
        }

        $scope.getRoute = function(){
            $scope.mapWayPoints = [];

            $scope.mapOrigin = $scope.tripRoute.trip_start;
            $scope.mapDestination = $scope.tripRoute.trip_end;
            var trip_waypoints = JSON.parse($scope.tripRoute.trip_details);
            for (var j = 0; j < trip_waypoints.length; j++) {
                var waypoint_location = {
                    lat : trip_waypoints[j].lat,
                    lng : trip_waypoints[j].lng
                }

                $scope.mapWayPoints.push({
                    location : waypoint_location,
                    stopover : true
                });
            }

            NgMap.initMap('Map');
        }

        $scope.viewHomePage = function(){
            $scope.$emit('viewHomePage');
        }

        $scope.viewUserTrips = function(){
            if($scope.user_id != 0){
                $scope.$emit('viewUserTrips');
            }
            else{
                var saveDetails = {
                    isSaveTrip: false
                }
                $scope.$emit('login', saveDetails);
            }
        };

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
            tripRoute: '='
        },
        templateUrl: "app/directives/trip-details/trip-details.html",
        link: link
    };
});
