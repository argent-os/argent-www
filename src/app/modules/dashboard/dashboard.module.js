(function() {
  'use strict';

  var module = angular.module('app.dashboard', ['ui.router', 'ngResource', 'app.resource', 'chartjs']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/modules/dashboard/dashboard.html',
        controller: 'dashboardController',
        controllerAs: 'vm'
      })
  }
})();
