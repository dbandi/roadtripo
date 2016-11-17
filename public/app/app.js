var app = angular.module('roadtripo',['ui.router','ngAutocomplete','ngMap', 'ngDialog', 'ngAnimate', 'LocalStorageModule', 'angular-parallax', 'angular-inview'])

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
            templateUrl: 'app/components/road-trip/explore-places/explore-places.html'
        })

        .state('trip.mytrips', {
            controller: 'mytripsController',
            url: '/mytrips',
            templateUrl: 'app/components/road-trip/my-trips/my-trips.html'
        })

        .state('trip.route', {
            controller: 'tripRouteController',
            url: '/route/:routeID',
            templateUrl: 'app/components/road-trip/trip-route/trip-route.html'
        });

    $urlRouterProvider.otherwise('/trip/start');

    localStorageServiceProvider.setPrefix('app');

});
