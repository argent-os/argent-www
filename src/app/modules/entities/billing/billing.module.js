(function() {
  'use strict';

  var module = angular.module('app.billing', ['ui.router', 'ngResource', 'app.resource', 'app.common', 'app.module.billing']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];
  // do not forget to import the module js in index!
  function appConfig($stateProvider) {
    $stateProvider
      .state('app.billing', {
          url: '/billing/',
          controller: 'BillingController',
          templateUrl: 'app/modules/entities/billing/views/billing.html',
          controllerAs: 'vm'
      })
      .state('app.createbill', {
          url: '/bill/create/',
          controller: 'BillingController',
          templateUrl: 'app/modules/entities/billing/views/billing.html',
          controllerAs: 'vm'
      });
  }
})();
