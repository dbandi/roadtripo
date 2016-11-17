var app = angular.module('roadtripo',['ngAutocomplete','ngMap', 'ngDialog', 'ngAnimate']);

app.controller('roadtripoController',['$scope', '$http', 'dataService', 'dataFactory', 'NgMap', 'ngDialog', '$animate', function($scope, $http, dataService, dataFactory, NgMap, ngDialog, $animate) {

    NgMap.getMap({id:'contactmap'}).then(function(map) {
      map.setZoom(4);
    });

    $scope.cities = [];
    $scope.places = [];
    $scope.allPlaces = [];
    $scope.trip = [];
    $scope.tripId = 0;
    $scope.tripDetails = [];
    $scope.tripRoute = [];

    $scope.source = "";
    $scope.destination = "";

    $scope.userEmail = "";
    $scope.userPassword = "";
    $scope.userPhone = "";
    $scope.userName = "";

    $scope.isSaveTrip = false;
    $scope.loginError = "";

    $scope.homePage = true;
    $scope.listCities = false;
    $scope.userTrips = false;
    $scope.viewDetails = false;

    $scope.userId = 0;
    $scope.mytrips = [];

    dataService.getUserId().then(function (response) {
        $scope.userId = response.data;
    });

    $scope.plantrip = function(){
        $scope.homePage = false;
        $scope.listCities = true;
        $scope.viewDetails = false;

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

    $scope.getTrips = function(tripId){
        console.log(tripId);
        dataService.getTripRoute(tripId).then(function (response) {
            $scope.tripRoute = response.data[0];
            $scope.mytrips = response.data;

            $scope.homePage = false;
            $scope.listCities = false;
            $scope.userTrips = false;
            $scope.viewDetails = true;
        });
    };

    $scope.$on('viewUserTrips', function(ev, data) {
        dataService.getTrips().then(function (response) {
            $scope.mytrips = response.data;

            $scope.homePage = false;
            $scope.listCities = false;
            $scope.userTrips = true;
            $scope.viewDetails = false;
        });
    });

    $scope.$on('viewHomePage', function(ev, data) {
        $scope.homePage = true;
        $scope.listCities = false;
        $scope.userTrips = false;
        $scope.viewDetails = false;
    });

    $scope.$on('viewPlaces', function(ev, data) {
        $scope.homePage = false;
        $scope.listCities = true;
        $scope.userTrips = false;
        $scope.viewDetails = false;
    });

    $scope.$on('viewDetails', function(ev, data) {
        $scope.homePage = false;
        $scope.listCities = false;
        $scope.userTrips = false;
        $scope.tripId = data;

        dataService.getTripRoute($scope.tripId).then(function (response) {
            $scope.tripRoute = response.data[0];
            $scope.viewDetails = true;
        });
    });

    $scope.$on('login', function(ev, data) {
        $scope.isSaveTrip = data.isSaveTrip;

        if($scope.isSaveTrip){
            $scope.tripDetails = data.tripDetails;
            $scope.trip = data.trip;
        }

        ngDialog.open({ template: 'app/modals/login.html', className: 'ngdialog-theme-default', scope: $scope });
    });

    $scope.signupForm = function(){
        $scope.$emit('signup');
    }

    $scope.$on('signup', function(ev, data) {
        ngDialog.close();
        ngDialog.open({ template: 'app/modals/signup.html', className: 'ngdialog-theme-default', scope: $scope });
    });

    $scope.viewUserTrips = function(){
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

        dataService.login(userDetails).then(function (response) {
            if(response.data.success){
                $scope.userId = response.data.user_id;
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

    $scope.signup = function (userName, userEmail, userPassword, userPhone) {
        $scope.userName = userName;
        $scope.userEmail = userEmail;
        $scope.userPassword = userPassword;
        $scope.userPhone = userPhone;

        var userDetails = {
            username : $scope.userEmail,
            password : $scope.userPassword,
            uname : $scope.userName,
            userphone : $scope.userPhone
        }

        dataService.signup(userDetails).then(function (response) {
            if(response.data.success){
                $scope.userId = response.data.user_id;
                ngDialog.close();
            }
            else{
                $scope.signUpError = "Sorry! You could not sign up.";
            }
        });

    };


}]);
