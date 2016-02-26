(function() {
  'use strict';

  var module = angular.module('app.customers', ['ui.router', 'ngResource', 'app.resource', 'app.common', 'app.module.customers', 'app.customer.modal', 'app.rb.modal']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];
  // do not forget to import the module js in index!
  function appConfig($stateProvider) {
    $stateProvider
      .state('app.customers', {
          url: '/customers/',
          controller: 'CustomersController',
          templateUrl: 'app/modules/entities/customers/views/customers.html',
          controllerAs: 'vm'
      })
      .state('app.createcustomer', {
          url: '/add/customer/',
          controller: 'CustomersController',
          templateUrl: 'app/modules/entities/customers/views/createcustomer.html',
          controllerAs: 'vm'
      });
  }
})();
