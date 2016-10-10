app.service('dataService', function($http) {

    this.getCities = function(source, destination) {
        return $http({
            method: 'GET',
            url: '/plantrip?source='+source+'&destination='+destination,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        });
     };

     this.getPlaces = function(placetypes, lat, lng) {
         return $http({
             method: 'GET',
             url: '/places?placetypes='+placetypes+'&lat='+lat+'&lng='+lng,
             headers: {'Content-Type': 'application/json; charset=utf-8'}
         });
      };

      this.getPlacesFilter = function(placetypes, lat, lng) {
          return $http({
              method: 'GET',
              url: '/placefilter?placetypes='+placetypes+'&lat='+lat+'&lng='+lng,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
       };

      this.getPhotos = function(placeName) {
          return $http({
              method: 'GET',
              url: '/photos?placeName='+placeName,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }     

      this.saveTrip = function(places) {
          return $http({
              method: 'POST',
              url: '/savetrip',
              data: places,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }
});
