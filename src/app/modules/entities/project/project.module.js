(function() {
  'use strict';

  var module = angular.module('app.project', ['ui.router', 'ngResource', 'app.resource', 'app.common', 'app.module.project', 'app.project.modal']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.project', {
        url: '/project/',
        templateUrl: 'app/modules/entities/project/edit/project.html',
        controller: 'dashboardController',
        controllerAs: 'vm'        
      })
      .state('app.projectdetails', {
        url: '/project/:name',
        templateUrl: 'app/modules/entities/project/edit/projectdetails.html',
        controller: 'ProjectController',
        controllerAs: 'vm'        
      })     
      .state('app.taskdetails', {
        url: '/task/:name',
        templateUrl: 'app/modules/entities/project/edit/taskdetails.html',
        controller: 'ProjectController',
        controllerAs: 'vm'        
      })             
  }
})();
