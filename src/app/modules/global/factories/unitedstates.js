(function() {
  'use strict';

  var us_states = angular.module('app.us_states', [])

  us_states.factory('UnitedStatesFactory', ['$http', '$location', function($http, $location) { 
    	return {
        	get:  function(){
            	return $http.get($location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/app/json/unitedstates.json'); // this will return a promise to controller
        	}
  		};
	}]);
})();
