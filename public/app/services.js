app.service('dataService', function($http) {

    this.getCities = function() {
        return $http({
            method: 'GET',
            url: '/plantrip',
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        });
     };

     this.getPlaces = function(placetypes, lat, lng) {
         return $http({
             method: 'GET',             
             url: '/places?placetypes='+placetypes+"&lat="+lat+"&lng="+lng,
             headers: {'Content-Type': 'application/json; charset=utf-8'}
         });
      };
});
