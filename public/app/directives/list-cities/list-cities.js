app.directive("listCities", function(dataService, dataFactory, $timeout, ngDialog, $animate) {

    function link($scope) {

        $scope.listCities = true;
        $scope.sourceCity = $scope.source.split(',')[0];
        $scope.destinationCity = $scope.destination.split(',')[0];
        $scope.initPlaces = $scope.places;

        $scope.mapSource = 'Chicago, IL';
        $scope.mapDestination = 'Milwaukee, WI';
        $scope.activeMap = '';

        $scope.showGasPrices = false;
        $scope.showHotels = false;

        $scope.getYelpPlacesofCities = function(placetypes){
            $scope.listCities = true;
            $scope.showGasPrices = false;
            $scope.showHotels = false;
            //Reset PLaces
            $scope.places = [];
            var citiesLength = Object.keys($scope.cities).length;

            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;
                dataService.getPlacesFilter(placetypes, $scope.cities[i].lat, $scope.cities[i].lng).then(function (response) {
                    for (var j = 0; j < response.data.businesses.length; j++) {
                        var responseData = response.data.businesses[j];
                        var placesModel = dataFactory.getYelpAPIplacesModel(responseData);
                        $scope.places.push(placesModel);
                    }
                });
            }
        };

        $scope.getFoursquarePlacesofCities = function(){
            $scope.showGasPrices = false;
            $scope.showHotels = false;
            $scope.places = $scope.initPlaces;
        }

        $scope.getGasStationPlacesofCities = function(){
            $scope.places = [];
            $scope.showGasPrices = true;
            $scope.showHotels = false;

            var citiesLength = Object.keys($scope.cities).length;

            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;
                dataService.getGasStations('reg', $scope.cities[i].lat, $scope.cities[i].lng, 2, 'distance').then(function (response) {
                    for (var j = 0; j < response.data.length; j++) {
                        var responseData = response.data[j];
                        var placesModel = dataFactory.getGasStationAPIplacesModel(responseData);
                        $scope.places.push(placesModel);
                    }
                });
            }
        }

        $scope.getHotelPlacesofCities = function(){
            $scope.places = [];
            $scope.showGasPrices = false;
            $scope.showHotels = true;

            var citiesLength = Object.keys($scope.cities).length;

            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;
                dataService.getHotels($scope.cities[i].lat, $scope.cities[i].lng, '07/03/2015', '07/06/2015', 2, 1).then(function (response) {
                    for (var j = 0; j < response.data.length; j++) {
                        var responseData = response.data[j];
                        var placesModel = dataFactory.getAirbnbAPIplacesModel(responseData);
                        $scope.places.push(placesModel);
                    }
                });
            }
        }

        $scope.viewMap = function(place){
            $scope.mapSource = place.city + ',' + place.state;
            $scope.mapDestination = place.address;
            $scope.activeMap = place.placeid;
            NgMap.initMap('Map');
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

            if($scope.tripId == 0){
                dataService.saveTrip(tripDetails).then(function (response) {

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
            else{
                dataService.updateTrip(tripDetails).then(function (response) {
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

        $scope.viewHomePage = function(){
            $scope.$emit('viewHomePage');
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
