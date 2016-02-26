(function() {
  'use strict';

  var countries = angular.module('app.countries', [])

  countries.factory('CountryFactory', ['$http', '$location', function($http, $location) { 
    	return {
        	get:  function(){
            	return $http.get($location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/app/json/countries.json'); // this will return a promise to controller
        	}
  		};
	}]);
})();
