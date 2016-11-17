app.controller('roadtripoController', function($scope, $http, dataService, dataFactory, NgMap, ngDialog, $animate, $state, $stateParams, localStorageService) {

    $scope.places = [];
    $scope.cities = [];
    $scope.roadtrip = {};
    $scope.userId = 0;

    $scope.accountStatus = "Login";

    $scope.plantrip = [];
    $scope.tripId = 0;
    $scope.tripPlanId = 0;

    $scope.source = "";
    $scope.destination = "";

    dataService.getUserId().then(function (response) {
        if(response.data != "unauthorized"){
            $scope.userId = response.data;
            $scope.accountStatus = "My Trips";

            if(localStorageService.get('plantripDetails') && localStorageService.get('plantripDetails') == "mytrips"){
                $scope.roadtrip.plantripDetails = localStorageService.get('plantripDetails');
                dataService.saveTrip($scope.roadtrip.plantripDetails).then(function (response) {
                    localStorageService.remove('plantripDetails');
                    localStorageService.remove('pageRedirect');
                    $state.go('trip.mytrips');
                });
            }
        }
    });

    $scope.$on('login', function(ev) {
        ngDialog.open({ template: 'app/modals/login.html', className: 'ngdialog-theme-default', scope: $scope });
    });

    $scope.$on('signup', function(ev, data) {
        ngDialog.close();
        ngDialog.open({ template: 'app/modals/signup.html', className: 'ngdialog-theme-default', scope: $scope });
    });

    $scope.signupForm = function(){
        $scope.$emit('signup');
    }

    $scope.$on('viewUserTrips', function(ev, data) {
        if($scope.userId == 0){
            $scope.$emit('login');
        }
        else{
            $state.go('trip.mytrips');
        }
    });

    $scope.goHome = function(){
        localStorageService.remove('plantripDetails');
        localStorageService.remove('pageRedirect');
        $state.go('trip.start');
    }

    $scope.myTrips = function(){
        if($scope.userId == 0){
            $scope.$emit('login');
        }
        else{
            $scope.accountStatus = "My Trips";
            $state.go('trip.mytrips');
        }
    }

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
                $state.go('trip.start');
            }
            else{
                $scope.signUpError = "Sorry! You could not sign up.";
            }
        });

    };
});
