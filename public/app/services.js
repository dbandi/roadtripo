app.service('dataService', function($http) {

    this.getCitiesInRoute = function(source, destination) {
        console.log(source);
        console.log(destination);
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

       this.getGasStations = function(fueltype, lat, lng, radius, sort_by){
           return $http({
               method: 'GET',
               url: '/gasprices?fueltype='+fueltype+'&lat='+lat+'&lng='+lng+'&radius='+radius+'&sort_by='+sort_by,
               headers: {'Content-Type': 'application/json; charset=utf-8'}
           });
       }

       this.getHotels = function(lat, lng, check_in, check_out, guests, page){
           return $http({
               method: 'GET',
               url: '/hotels?lat='+lat+'&lng='+lng+'&check_in='+check_in+'&check_out='+check_out+'&guests='+guests+'&page='+page,
               headers: {'Content-Type': 'application/json; charset=utf-8'}
           });
       }

      this.getPhotos = function(placeName) {
          return $http({
              method: 'GET',
              url: '/photos?placeName='+placeName,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.saveTrip = function(tripDetails) {
          return $http({
              method: 'POST',
              url: '/savetrip',
              data: tripDetails,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.updateTrip = function(tripId, tripDetails) {
          trip = {
              trip_id : tripId,
              trip_details : tripDetails
          };
          return $http({
              method: 'POST',
              url: '/updatetrip',
              data: trip,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.login = function(userDetails) {
          return $http({
              method: 'POST',
              url: '/login',
              data: userDetails,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.signup = function(userDetails) {
          return $http({
              method: 'POST',
              url: '/signup',
              data: userDetails,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.getUserId = function() {
          return $http({
              method: 'GET',
              url: '/getuserid',
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.getTrips = function() {
          return $http({
              method: 'GET',
              url: '/gettrips',
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.getTripRoute = function(tripId){
          return $http({
              method: 'GET',
              url: '/gettriproute?trip_id='+tripId,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.deleteTrip = function(tripId){
          return $http({
              method: 'GET',
              url: '/deleteTrip?trip_id='+tripId,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.stateExplore = function(search){
          return $http({
              method: 'GET',
              url: '/stateexplore?search='+search,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.citiesExplore = function(search){
          return $http({
              method: 'GET',
              url: '/citiesexplore?search='+search,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.getCities = function(){
          return $http({
              method: 'GET',
              url: '/getcities',
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.getCityLatLng = function(city){
          return $http({
              method: 'GET',
              url: '/getcitylatlng?city='+city,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.placeLocationDetails = function(placename, lat, lng, type){
          return $http({
              method: 'GET',
              url: '/placeLocationDetails?placename='+placename+'&type='+type+'&lat='+lat+'&lng='+lng,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.placeReviewsDetails = function(placeid){
          return $http({
              method: 'GET',
              url: '/placeReviewsDetails?placeid='+placeid,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }

      this.getFoodDetails = function(food_name_id){
          return $http({
              method: 'GET',
              url: '/getfooddetails?food_name_id='+food_name_id,
              headers: {'Content-Type': 'application/json; charset=utf-8'}
          });
      }
});
