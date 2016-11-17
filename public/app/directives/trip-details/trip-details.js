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

        $scope.tripOrigin = s = $scope.mapOrigin.substring(0, $scope.mapOrigin.indexOf(','));
        $scope.tripDestination = s = $scope.mapDestination.substring(0, $scope.mapDestination.indexOf(','));

        $scope.isEdit = false;

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

        $scope.deleteTrip = function(tripRoute){
            ngDialog.open({ template: 'app/modals/delete.html', className: 'ngdialog-theme-default', scope: $scope });
        };

        $scope.confirmDeleteTrip = function(){
            dataService.deleteTrip($scope.tripRoute.trip_id).then(function (response) {
                dataService.getTrips().then(function(response){
                    $scope.mytrips = response.data;
                    ngDialog.close();
                    $scope.$emit('viewUserTrips');
                });
            });
        }

        $scope.removePitstop = function(pitstopIndex){
            $scope.tripRouteDetails = $scope.tripRouteDetails.slice(pitstopIndex + 1);
        };

        $scope.editTrip = function(tripRoute){
            $scope.isEdit = true;
        };

        $scope.updateTrip = function(tripId){
            angular.forEach($scope.mytrips, function(value, key) {
              if(value.trip_id == tripId){
                  $scope.mytrips[key].trip_details = JSON.stringify($scope.tripRouteDetails);
                  console.log($scope.mytrips[key].trip_details);
              }
            });

            dataService.updateTrip(tripId, $scope.mytrips).then(function (response) {
                console.log(response.data);
            });
            $scope.isEdit = false;
        };
    }

    return {
        restrict: 'E',
        scope: {
            tripRoute: '=',
            mytrips: '='
        },
        templateUrl: "app/directives/trip-details/trip-details.html",
        link: link
    };
});
