app.directive("myTrips", function(dataService, dataFactory, $timeout, ngDialog, NgMap, $animate) {

    function link($scope) {

        $scope.alltrips = [];

        $scope.mapWayPoints = [];
         /* {location: {lat:45.32384807250689, lng: -78.079833984375}, stopover: true},
          {location: {lat:45.55916341529184, lng: -76.17919921875}, stopover: true},*/

        for (var i = 0; i < $scope.mytrips.length; i++) {
            var eachTrip = {
                user_id : $scope.mytrips[i].user_id,
                trip_id : $scope.mytrips[i].trip_id,
                trip_name : $scope.mytrips[i].trip_name,
                trip_start : $scope.mytrips[i].trip_start,
                trip_end : $scope.mytrips[i].trip_end,
                trip_details : JSON.parse($scope.mytrips[i].trip_details),
                trip_pitstopcount : (JSON.parse($scope.mytrips[i].trip_details)).length
            }
            $scope.alltrips.push(eachTrip);
        }

        $scope.mapOrigin = $scope.mytrips[0].trip_start;
        $scope.mapDestination = $scope.mytrips[0].trip_end;
        var trip_waypoints = JSON.parse($scope.mytrips[0].trip_details);
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

        $scope.getRoute = function(RouteNo){
            $scope.mapWayPoints = [];

            $scope.mapOrigin = $scope.mytrips[RouteNo].trip_start;
            $scope.mapDestination = $scope.mytrips[RouteNo].trip_end;
            var trip_waypoints = JSON.parse($scope.mytrips[RouteNo].trip_details);
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
            console.log("Homepage");
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
            mytrips: '=',
            userId: '='
        },
        templateUrl: "app/directives/my-trips/my-trips.html",
        link: link
    };
});
