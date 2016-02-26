(function() {
  'use strict';

  var module = angular.module('app.invoice', ['ui.router', 'ngResource', 'app.resource', 'app.common', 'app.module.invoice']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];
  // do not forget to import the module js in index!
  function appConfig($stateProvider) {
    $stateProvider
      .state('app.invoice', {
          url: '/invoice/',
          templateUrl: 'app/modules/entities/invoice/views/invoice.html',
          controllerAs: 'vm'
      })
      .state('app.createinvoice', {
          url: '/invoice/create/',
          templateUrl: 'app/modules/entities/invoice/views/invoice.html',
          controllerAs: 'vm'
      });
  }
})();
