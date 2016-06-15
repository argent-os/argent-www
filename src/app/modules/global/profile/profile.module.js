(function() {
  'use strict';

  var module = angular.module('app.profile', ['ui.router']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function appConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        data: {
          noAuth: true
        },
        templateUrl: 'app/modules/global/profile/auth/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      // .state('register', {
      //   url: '/register',
      //   data: {
      //     noAuth: true
      //   },
      //   templateUrl: 'app/modules/global/profile/auth/register.html',
      //   controller: 'RegisterController',
      //   controllerAs: 'vm'
      // })
      .state('forgot', {
        url: '/forgot',
        data: {
          noAuth: true
        },
        templateUrl: 'app/modules/global/profile/auth/forgot.html',
        controller: 'PasswordController',
        controllerAs: 'vm'
      })  
      .state('reset', {
        url: '/reset?token',
        data: {
          noAuth: true
        },
        templateUrl: 'app/modules/global/profile/auth/reset.html',
        controller: 'PasswordController',
        controllerAs: 'vm'
      })   
      .state('verify', {
        url: '/verify?token',
        data: {
          noAuth: false
        },
        templateUrl: 'app/modules/global/profile/auth/verify.html',
        controller: 'VerifyController',
        controllerAs: 'vm'
      })                    
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'app/modules/global/profile/edit/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      })
      .state('app.editprofile', {
        url: '/profile/edit',
        templateUrl: 'app/modules/global/profile/edit/edit-profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      })      
      .state('app.integrations', {
        url: '/integrations',
        templateUrl: 'app/modules/global/profile/edit/integrations.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      })
      .state('app.card', {
        url: '/card',
        templateUrl: 'app/modules/global/profile/edit/card.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      })   
      .state('app.bank', {
        url: '/bank',
        templateUrl: 'app/modules/global/profile/edit/bank.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      })            
      .state('app.plans', {
        url: '/plans',
        templateUrl: 'app/modules/global/profile/edit/plans.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      });                   
  }
})();
