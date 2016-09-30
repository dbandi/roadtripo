app.directive("listPlaces", function() {

    function link($scope) {
        
    }

    return {
        restrict: 'E',
        scope: {
            places: '='
        },
        templateUrl: "app/directives/list-places/list-places.html",
        link: link
    };
});
