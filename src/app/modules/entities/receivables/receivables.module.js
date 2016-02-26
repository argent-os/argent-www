(function() {
  'use strict';

  var module = angular.module('app.receivables', ['ui.router', 'ngResource', 'app.resource', 'app.common', 'app.module.receivables']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];
  // do not forget to import the module js in index!
  function appConfig($stateProvider) {
    $stateProvider
      .state('app.receivables', {
          url: '/receivables/',
          controller: 'ReceivablesController',
          templateUrl: 'app/modules/entities/receivables/views/receivables.html',
          controllerAs: 'vm'
      })
      .state('app.createreceivable', {
          url: '/receivables/create/',
          controller: 'ReceivablesController',
          templateUrl: 'app/modules/entities/receivables/views/receivables.html',
          controllerAs: 'vm'
      });
  }
})();
