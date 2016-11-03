app.directive("myTrips", function(dataService, dataFactory, $timeout, ngDialog, NgMap, $animate) {

    function link($scope) {

        $scope.alltrips = [];
        console.log($scope.mytrips);
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

        $scope.viewTrip = function(){
            $scope.$emit('viewTrip');
        }

        $scope.viewDetails = function(tripId){
            $scope.$emit('viewDetails', tripId);
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
