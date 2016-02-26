(function() {
    'use strict';

    angular
        .module('app.organization')
        .factory('OrganizationFactory', OrganizationFactory)
        .controller('OrganizationListController', organizationListController);

    organizationListController.$inject = ['$scope', '$window', 'OrganizationFactory', 'deleteOrganizationModal'];
    function organizationListController($scope, $window, OrganizationFactory, deleteOrganizationModal) {
      var vm = this;      
      var store = $window.localStorage;
      vm.delete = deleteOrganizationModal.getDeleteMethod($scope.organization); //fix    
    }

    OrganizationFactory.$inject = ['$http', '$q', '$rootScope', '$stateParams', '$window', 'AuthTokenFactory', 'UserFactory', 'appconfig'];
    function OrganizationFactory($http, $q, $rootScope, $stateParams, $window, AuthTokenFactory, UserFactory, config) {
      'use strict';
      var vm = this;
      var store = $window.localStorage;
      vm.getOrganization = getOrganization;
      vm.addOrganization = addOrganization;

      return {
        getOrganization: getOrganization,
        addOrganization: addOrganization
      };

      function getOrganization(user) {
        if (AuthTokenFactory.getToken() && user.data.orgId) {
          var d = $q.defer();                
          $http.get(config.apiRoot + '/v1/organization/'+user.data.orgId)
              .success(function (response) {
                  response._id !== null ? $rootScope.orgFound = true : '';                
                  // console.log(response);
                  d.resolve(response);
              }).error(function(err) {
                  // console.log(err);
                  err.state == 'not_found' ? $rootScope.orgFound = false : '';
                  d.reject(err);
              });
            return d.promise;
        } else {
          console.log('no auth token');
        }
      } 
      function addOrganization(name) {
        var _name = name;
        if (AuthTokenFactory.getToken()) {
          var d = $q.defer();                
          $http.post(config.apiRoot + '/v1/organization/', { name: _name })
              .success(function (response) {
                  console.log(response);
                  response._id !== null ? $rootScope.orgFound = true : '';                
                  // console.log(response);
                  d.resolve(response);
              }).error(function(err) {
                  // console.log(err);
                  console.log(err);
                  err.state == 'not_found' ? $rootScope.orgFound = false : '';
                  d.reject(err);
              });
            return d.promise;
        } else {
          console.log('no auth token');
        }
      }       
    };        
})();
