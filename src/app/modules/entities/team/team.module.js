(function() {
  'use strict';

  var module = angular.module('app.team', ['ui.router', 'ngResource', 'app.resource', 'app.common', 'firebase']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.team', {
          url: '/team/:id',
          controller: 'TeamLogsController',
          templateUrl: 'app/modules/entities/team/views/team.html',
          controllerAs: 'vm'
      })
      .state('app.teamProjects', {
          url: '/team/projects',
          controller: 'TeamProjectsController',
          templateUrl: 'app/modules/entities/team/views/team.html',
          controllerAs: 'vm'
      })        
      .state('app.teamEditProject', {
          url: '/team/projects/:projectId',
          controller: 'TeamCourseViewController',
          templateUrl: 'app/modules/entities/team/views/team.html',
          controllerAs: 'vm'
      })
      .state('app.teamAllStatistics', {
          url: '/team/statistics',
          controller: 'TeamStatisticsController',
          templateUrl: 'app/modules/entities/team/views/team.html',
          controllerAs: 'vm'
      })
      .state('app.teamDetailStatistics', {
          url: '/team/statistics/:id',
          controller: 'TeamStatisticsController',
          templateUrl: 'app/modules/entities/team/views/team.html',
          controllerAs: 'vm'
      });
  }
})();
