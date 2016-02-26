(function(){'use strict';var core=angular.module('app.core',['ngResource','ui.router','ngAnimate','toastr','satellizer']);core.config(appConfig);core.config(httpConfig);core.config(oAuthConfig);oAuthConfig.$inject=['$authProvider'];function oAuthConfig($authProvider){$authProvider.facebook({clientId:'1650383125184904'});};httpConfig.$inject=['$provide','$httpProvider'];function httpConfig($provide,$httpProvider){$provide.factory('AuthInterceptor',['$q','$location','AuthTokenFactory',function($q,$location,AuthTokenFactory){return{request:function(config){var token=AuthTokenFactory.getToken();if(token){config.headers=config.headers||{};config.headers.Authorization='Bearer '+token;}return config||$q.when(config);},requestError:function(rejection){return $q.reject(rejection);},response:function(response){return response||$q.when(response);},responseError:function(rejection){return $q.reject(rejection);}};}]);$httpProvider.interceptors.push('AuthInterceptor');};appConfig.$inject=['$stateProvider','$urlRouterProvider','$locationProvider'];function appConfig($stateProvider,$urlRouterProvider,$locationProvider){$locationProvider.html5Mode(true);$stateProvider.state('app',{url:'/app',abstract:true,templateUrl:'app/modules/global/core/app.html'});$urlRouterProvider.otherwise(function($injector){var $state=$injector.get('$state');$state.go('login');});}})();