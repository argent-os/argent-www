(function() {
  'use strict';

  var module = angular.module('app.timetracker', ['ui.router', 'ngResource', 'app.resource', 'app.common', 'firebase']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.timetrackerId', {
          url: '/timetracker/:id',
          controller: 'LogsController',
          templateUrl: 'app/modules/entities/timetracker/views/logs.html',
          controllerAs: 'vm'
      })
      .state('app.statsbreakdown', {
          url: '/timetracker/statistics/breakdown',
          controller: 'LogsController',
          templateUrl: 'app/modules/entities/timetracker/views/breakdown.html',
          controllerAs: 'vm'
      })      
      .state('app.timetrackerProjects', {
          url: '/timetracker/projects',
          controller: 'ProjectsController',
          templateUrl: 'app/modules/entities/timetracker/views/projects.html',
          controllerAs: 'vm'
      })        
      .state('app.timetrackerEditProject', {
          url: '/timetracker/projects/:projectId',
          controller: 'CourseViewController',
          templateUrl: 'app/modules/entities/timetracker/views/projectItem.html',
          controllerAs: 'vm'
      })
      .state('app.timetrackerAllStatistics', {
          url: '/timetracker/statistics',
          controller: 'StatisticsController',
          templateUrl: 'app/modules/entities/timetracker/views/statistics.html',
          controllerAs: 'vm'
      })
      .state('app.timetrackerDetailStatistics', {
          url: '/timetracker/statistics/:id',
          controller: 'StatisticsController',
          templateUrl: 'app/modules/entities/timetracker/views/statistics.html',
          controllerAs: 'vm'
      });
  }
})();
