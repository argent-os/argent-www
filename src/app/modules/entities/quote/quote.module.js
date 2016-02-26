(function() {
  'use strict';

  var module = angular.module('app.quote', ['ui.router', 'ngResource', 'app.resource', 'app.common', 'app.module.quote']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];
  // do not forget to import the module js in index!
  function appConfig($stateProvider) {
    $stateProvider
      .state('app.createquote', {
          url: '/new/quote/',
          controller: 'QuotesController',
          templateUrl: 'app/modules/entities/quote/views/createquote.html',
          controllerAs: 'vm'
      })
      .state('app.quotes', {
          url: '/my/quotes',
          controller: 'QuotesController',
          templateUrl: 'app/modules/entities/quote/views/myquotes.html',
          controllerAs: 'vm'
      });
  }
})();
