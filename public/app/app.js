var app = angular.module('roadtripo',['ngAutocomplete','ngMap', 'ngDialog']);

app.controller('myController',['$scope', '$http', 'dataService', 'dataFactory', 'NgMap', 'ngDialog', function($scope, $http, dataService, dataFactory, NgMap, ngDialog) {

    NgMap.getMap({id:'contactmap'}).then(function(map) {
      map.setZoom(4);      
    });

    $scope.cities = [];
    $scope.places = [];
    $scope.allPlaces = [];
    $scope.trip = [];
    $scope.tripId = 0;
    $scope.tripDetails = [];

    $scope.source = "";
    $scope.destination = "";

    $scope.userEmail = "";
    $scope.userPassword = "";

    $scope.isSaveTrip = false;
    $scope.loginError = "";

    $scope.homePage = true;
    $scope.listCities = false;
    $scope.userTrips = false;

    $scope.userId = 0;
    $scope.mytrips = [];

    dataService.getUserId().then(function (response) {
        console.log(response.data);
        $scope.userId = response.data;
    });

    $scope.plantrip = function(){
        $scope.homePage = false;
        $scope.listCities = true;

        var source = $scope.source.replace(/ /g, '+');
        var destination = $scope.destination.replace(/ /g, '+');

        dataService.getCities(source, destination).then(function (response) {
            $scope.cities = response.data;

            var citiesLength = Object.keys($scope.cities).length;
            for (var i = 0; i < citiesLength; i++) {
                $scope.listPlaces = true;
                var placetypes = 'Popular+with+Visitors';

                dataService.getPlaces(placetypes, $scope.cities[i].lat, $scope.cities[i].lng).then(function (response) {
                    for (var j = 0; j < response.data.response.groups[0].items.length; j++) {
                        var responseData = response.data.response.groups[0].items[j].venue;
                        var placesModel = dataFactory.getFoursquareAPIplacesModel(responseData);
                        $scope.places.push(placesModel);
                    }
                });
            }
        });
    };

    $scope.$on('viewUserTrips', function(ev, data) {
        dataService.getTrips().then(function (response) {
            $scope.mytrips = response.data;

            $scope.homePage = false;
            $scope.listCities = false;
            $scope.userTrips = true;
        });
    });

    $scope.$on('viewPlaces', function(ev, data) {
        $scope.homePage = false;
        $scope.listCities = true;
        $scope.userTrips = false;
    });

    $scope.$on('login', function(ev, data) {
        $scope.isSaveTrip = data.isSaveTrip;

        if($scope.isSaveTrip){
            $scope.tripDetails = data.tripDetails;
            $scope.trip = data.trip;
        }

        ngDialog.open({ template: 'app/modals/login.html', className: 'ngdialog-theme-default', scope: $scope });
    });

    $scope.viewUserTrips = function(){
        console.log($scope.userId);
        if($scope.userId != 0 && $scope.userId != "unauthorized"){
            $scope.$emit('viewUserTrips');
        }
        else{
            var saveDetails = {
                isSaveTrip: false
            }
            $scope.$emit('login', saveDetails);
        }
    };

    $scope.login = function (userEmail,userPassword) {
        $scope.userEmail = userEmail;
        $scope.userPassword = userPassword;

        var userDetails = {
            username : $scope.userEmail,
            password : $scope.userPassword
        }
        console.log($scope.isSaveTrip);
        dataService.login(userDetails).then(function (response) {
            console.log(response);
            if(response.data.success){
                $scope.userId = response.data.user_id;
                console.log($scope.userId);
                ngDialog.close();

                if($scope.isSaveTrip == true){
                    dataService.saveTrip($scope.tripDetails).then(function (response) {
                        // Successfully Saved Trip
                        if(response.status == 200){
                            $scope.tripId = parseInt(response.data);
                        }
                    });
                }
            }
            else{
                $scope.loginError = "Not a valid login credentials";
            }
        });

    };


}]);
