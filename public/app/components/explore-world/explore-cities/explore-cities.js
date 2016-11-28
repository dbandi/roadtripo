app.controller('citiesController', function($window, $compile, $rootScope, $scope, $http, $stateParams, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService, $timeout) {

    $scope.search = $stateParams.search;
    $scope.exploreCityName = $scope.search.replace(/_/g, " ");

    $scope.exploreCityFoods = [];
    $scope.exploreCityAdventures = [];
    $scope.exploreCityAttractions = [];

    dataService.citiesExplore($scope.search).then(function (response) {
        $scope.exploreCityFoods = [];
        $scope.exploreCityAdventures = [];
        $scope.exploreCityAttractions = [];

        var citiesArray = response.data;

        angular.forEach(citiesArray, function(citiesPlaceList, key) {

            angular.forEach(citiesPlaceList, function(value, key) {

                if(value.hasOwnProperty('food_id')){

                    var newCityFood = {
                        foodId: value.food_id,
                        foodName: value.food_name,
                        foodNameId: value.food_name_id,
                        foodType: value.food_type,
                        foodImage: value.food_image,
                        foodVideo: value.food_video,
                        foodCategory: value.food_category
                    }

                    $scope.exploreCityFoods.push(newCityFood);
                }

                if(value.hasOwnProperty('adventure_id')){
                    console.log(value);
                    var newCityAdventure = {
                        adventureId: value.adventure_id,
                        adventureName: value.adventure_name,
                        adventureNameId: value.adventure_name_id,
                        adventureType: value.adventure_type,
                        adventureImage: value.adventure_image,
                        adventureVideo: value.adventure_video,
                        adventureCategory: value.adventure_category
                    }

                    $scope.exploreCityAdventures.push(newCityAdventure);
                }

                if(value.hasOwnProperty('attractions_id')){
                    console.log(value);
                    var newCityAttraction = {
                        attractionsId: value.attractions_id,
                        attractionsName: value.attractions_name,
                        attractionsNameId: value.attractions_name_id,
                        attractionsType: value.attractions_type,
                        attractionsImage: value.attractions_image,
                        attractionsVideo: value.attractions_video,
                        attractionsCategory: value.attractions_category
                    }

                    $scope.exploreCityAttractions.push(newCityAttraction);
                }

            });
        });

    });

});
