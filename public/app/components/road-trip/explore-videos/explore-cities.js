app.controller('citiesController', function($window, $compile, $rootScope, $scope, $http, $stateParams, dataService, dataFactory, NgMap, ngDialog, $animate, $state, localStorageService, $timeout) {

    var search = $stateParams.search;

    $scope.videos = [{
        videoId: '',
        mute: false,
        start: 0,
        end: 0
    }];

//$scope.videos= [];
    dataService.videoExplore(search).then(function (response) {
        videoData = response.data;

        angular.forEach(videoData, function(value, key) {
            console.log(value);
            var newVideo = {
                videoId: value.video_link_id,
                mute: false,
                start: value.video_start,
                end: value.video_end
            }

            $scope.videos.push(newVideo);

        });

        //angular.element(document).find('.preference-template').html($compile('<div>rr</div>'));

    });

});
