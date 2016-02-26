(function() {
  'use strict';

  angular.module('app.resource')
    .factory('organizationResource', organizationResource);

  organizationResource.$inject = ['$resource', 'appconfig'];
  function organizationResource($resource, config) {
    return $resource(config.apiRoot + '/v1/organization/:id', {id: '@id'}, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }  
    });
  }

})();
