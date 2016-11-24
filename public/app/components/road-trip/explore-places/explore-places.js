app.controller('exploreController', function($rootScope, $scope, $http, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService) {

    if(typeof $scope.roadtrip.tripStart == "undefined"){
        $state.go('trip.start');
    }

    console.log($scope.roadtrip.tripStart);
    console.log($scope.roadtrip.tripEnd);

    var source = $scope.roadtrip.tripStart.replace(/ /g, '+');
    var destination = $scope.roadtrip.tripEnd.replace(/ /g, '+');

    $scope.sourceCity = $scope.roadtrip.tripStart.split(',')[0];
    $scope.destinationCity = $scope.roadtrip.tripEnd.split(',')[0];

    //Storing the default Result from Foursquare
    $scope.initPlaces = $scope.roadtrip.places;
    $scope.cities = [];

    if($rootScope.tripId != 0){
        $scope.places = $scope.roadtrip.places;
    }
    else{
        $rootScope.plantrip = [];
    }

    //Display parts in UI
    $scope.showGasPrices = false;
    $scope.showHotels = false;

    //Default Foursquare
    dataService.getCities(source, destination).then(function (response) {

        $scope.cities = response.data;
        $scope.places = [];

        console.log($scope.cities);

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

                $state.go('trip.explore');
            });
        }
    });

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
        console.log($rootScope.plantrip);
        var id = $rootScope.plantrip.length + 1;
        var found = $rootScope.plantrip.some(function (el) {
            return el.placeid === place.placeid;
        });

        if (!found) {
            $rootScope.plantrip.push(place);
        }
    };

    $scope.saveTrip = function(){
        $scope.roadtrip.plantripDetails = dataFactory.getTrip($scope.roadtrip.tripStart, $scope.roadtrip.tripEnd, $rootScope.plantrip, $rootScope.tripId);
        console.log($rootScope.tripId);
        if($rootScope.tripId == 0){
            dataService.saveTrip($scope.roadtrip.plantripDetails).then(function (response) {
                if(response.data == "unauthorized"){
                    localStorageService.set('plantripDetails', $scope.roadtrip.plantripDetails);
                    localStorageService.set('pageRedirect', 'mytrips');
                    $scope.$emit('login');
                }
                else{
                    $rootScope.tripId = parseInt(response.data);
                    $scope.$emit('viewUserTrips');
                }
            });
        }
        else{
            dataService.updateTrip($rootScope.tripId, $scope.roadtrip.plantripDetails).then(function (response) {
                $scope.$emit('viewUserTrips');
            });
        }

    };
});
