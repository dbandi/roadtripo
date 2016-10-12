app.directive("listCities", function(dataService, dataFactory, $timeout, ngDialog) {

    function link($scope) {

        $scope.listCities = true;
        $scope.sourceCity = $scope.source.split(',')[0];
        $scope.destinationCity = $scope.destination.split(',')[0];
        $scope.initPlaces = $scope.places;

        $scope.getYelpPlacesofCities = function(placetypes){
            $scope.listCities = true;

            //Reset PLaces
            $scope.places = [];
            var citiesLength = Object.keys($scope.cities).length;

            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;
                dataService.getPlacesFilter(placetypes, $scope.cities[i].lat, $scope.cities[i].lng).then(function (response) {
                    for (var j = 0; j < response.data.businesses.length; j++) {
                        var responseData = response.data.businesses[j];
                        console.log(responseData);
                        var placesModel = dataFactory.getYelpAPIplacesModel(responseData);
                        $scope.places.push(placesModel);
                    }
                });
            }
        };

        $scope.getFoursquarePlacesofCities = function(){
            $scope.places = $scope.initPlaces;
        }

        $scope.addToTrip = function(place){
            var id = $scope.trip.length + 1;
            var found = $scope.trip.some(function (el) {
                return el.placeid === place.placeid;
            });

            if (!found) {
                $scope.trip.push(place);
            }
        };

        $scope.saveTrip = function(){
            var tripDetails = dataFactory.getTrip($scope.source, $scope.destination, $scope.trip, $scope.tripId);
            console.log($scope.tripId);

            if($scope.tripId == 0){
                dataService.saveTrip(tripDetails).then(function (response) {
                    console.log(response);
                    if(response.data == "unauthorized"){
                        // sending true if to be saved trip after login
                        console.log($scope.trip);
                        var saveDetails = {
                            isSaveTrip: true,
                            tripDetails: tripDetails,
                            trip: $scope.trip
                        }
                        $scope.$emit('login', saveDetails);
                    }
                    else{
                        console.log(response.data);
                        $scope.tripId = parseInt(response.data);
                    }
                });
            }
            else{
                console.log($scope.tripId);
                dataService.updateTrip(tripDetails).then(function (response) {
                    console.log(response);
                    if(response.data == "unauthorized"){
                        // sending true if to be saved trip after login
                        var saveDetails = {
                            isSaveTrip: true,
                            tripDetails: tripDetails,
                            trip: $scope.trip
                        }
                        $scope.$emit('login', saveDetails);
                    }
                    else{
                        $scope.tripId = parseInt(response.data);
                    }
                });
            }

        };

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
    }

    return {
        restrict: 'E',
        scope: {
            cities: '=',
            places: '=',
            trip: '=',
            tripId: '=',
            tripDetails: '=',
            source: '=',
            destination: '=',
            isSaveTrip: '=',
            userId: '='
        },
        templateUrl: "app/directives/list-cities/list-cities.html",
        link: link
    };
});
