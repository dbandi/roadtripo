app.controller('exploreController', function($scope, $http, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService) {

    console.log($scope.roadtrip.tripStart);
    console.log($scope.roadtrip.tripEnd);
    console.log($scope.tripId);

    $scope.sourceCity = $scope.roadtrip.tripStart.split(',')[0];
    $scope.destinationCity = $scope.roadtrip.tripEnd.split(',')[0];

    //Storing the default Result from Foursquare
    $scope.initPlaces = $scope.roadtrip.places;

    //Display parts in UI
    $scope.showGasPrices = false;
    $scope.showHotels = false;

    $scope.getYelpPlacesofCities = function(placetypes){
        $scope.places = [];
        $scope.cities = $scope.roadtrip.cities;
        $scope.showGasPrices = false;
        $scope.showHotels = false;

        var citiesLength = Object.keys($scope.cities).length;

        for (var i = 0; i < citiesLength; i++) {
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
        $scope.cities = $scope.roadtrip.cities;
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
        $scope.cities = $scope.roadtrip.cities;
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

    $scope.addToTrip = function(place){
        var id = $scope.plantrip.length + 1;
        var found = $scope.plantrip.some(function (el) {
            return el.placeid === place.placeid;
        });

        if (!found) {
            $scope.plantrip.push(place);
        }
    };

    $scope.saveTrip = function(){
        $scope.roadtrip.plantripDetails = dataFactory.getTrip($scope.roadtrip.tripStart, $scope.roadtrip.tripEnd, $scope.plantrip, $scope.tripId);
        console.log($scope.tripId);
        if($scope.tripId == 0){
            dataService.saveTrip($scope.roadtrip.plantripDetails).then(function (response) {
                if(response.data == "unauthorized"){
                    localStorageService.set('plantripDetails', $scope.roadtrip.plantripDetails);
                    localStorageService.set('pageRedirect', 'mytrips');
                    $scope.$emit('login');
                }
                else{
                    $scope.tripId = parseInt(response.data);
                    $scope.$emit('viewUserTrips');
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
                        trip: $scope.plantrip
                    }
                    $scope.$emit('login', saveDetails);
                }
                else{
                    $scope.tripId = parseInt(response.data);
                }
            });
        }

    };
});
