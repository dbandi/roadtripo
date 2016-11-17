app.directive("pitStop", function(dataService, dataFactory, $timeout, ngDialog, NgMap, $animate, $window) {

    function link($scope) {

        $scope.$watch(function () {
            return $window.scrollY;
        }, function (scrollY) {

        });

        $scope.getOffset = function(thisPitsopIndex){
            console.log(600 * thisPitsopIndex);
            return 600 * thisPitsopIndex;
        };

    }
    return {
        restrict: 'E',
        scope: {
            pitStop: '=',
            viewPort: '=',
            pitstopIndex: '='
        },
        templateUrl: "app/directives/pit-stop/pit-stop.html",
        link: link
    };
});
