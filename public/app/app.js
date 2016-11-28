var app = angular.module('roadtripo',['ui.router','ngAutocomplete','ngMap', 'ngDialog', 'ngAnimate', 'LocalStorageModule', 'angular-parallax', 'angular-inview', 'youtube-embed', 'angularVideoBg', 'video-background', 'slick', 'vAccordion'])

// configuring our routes
// =============================================================================
.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

    $stateProvider

        .state('trip', {
            controller: 'roadtripoController',
            url: '/trip',
            templateUrl: 'app/components/home-page/home-page.html'
        })

        .state('trip.start', {
            controller: 'startController',
            url: '/start',
            templateUrl: 'app/components/road-trip/landing-page/landing-page.html'
        })

        .state('trip.explore', {
            controller: 'exploreController',
            url: '/explore',
            templateUrl: 'app/components/road-trip/list-places/list-places.html'
        })

        .state('trip.cities', {
            controller: 'citiesController',
            url: '/cities/:search',
            templateUrl: 'app/components/explore-world/explore-cities/explore-cities.html'
        })

        .state('trip.state', {
            controller: 'stateExploreController',
            url: '/state/:search',
            templateUrl: 'app/components/road-trip/state-explore/state-explore.html'
        })

        .state('trip.mytrips', {
            controller: 'mytripsController',
            url: '/mytrips',
            templateUrl: 'app/components/road-trip/my-trips/my-trips.html'
        })

        .state('trip.explorefood', {
            controller: 'exploreFoodController',
            url: '/explorefood/:city/:type/:placename',
            templateUrl: 'app/components/explore-world/explore-places/explore-food/explore-food.html'
        })

        .state('trip.exploreattractions', {
            controller: 'exploreAttractionsController',
            url: '/exploreattractions/:city/:type/:placename',
            templateUrl: 'app/components/explore-world/explore-places/explore-attractions/explore-attractions.html'
        })

        .state('trip.route', {
            controller: 'tripRouteController',
            url: '/route/:routeID',
            templateUrl: 'app/components/road-trip/trip-route/trip-route.html'
        });

    $urlRouterProvider.otherwise('/trip/start');

    localStorageServiceProvider.setPrefix('app');

});
