(function() {
  'use strict';

  var module = angular.module('app.organization', ['ui.router', 'ngResource', 'app.resource', 'app.common']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.organization', {
        url: '/organization/:id',
        templateUrl: 'app/modules/entities/organization/list/organization.html'
      })
      .state('app.editorganization', {
        url: '/organization/edit/:id',
        templateUrl: 'app/modules/entities/organization/edit/edit.html',
        resolve: {
          data: ['$stateParams', 'organizationResource', function($stateParams, organizationResource){
            return $stateParams.id ? organizationResource.get({id:$stateParams.id}).$promise : {};
          }]
        },
        controller: 'OrganizationController',
        controllerAs: 'vm'
      });
  }
})();
