(function(){'use strict';var module=angular.module('app.profile',['ui.router']);module.config(appConfig);appConfig.$inject=['$stateProvider'];function appConfig($stateProvider){$stateProvider.state('login',{url:'/login',data:{noAuth:true},templateUrl:'app/modules/global/profile/auth/login.html',controller:'LoginController',controllerAs:'vm'}).state('register',{url:'/register',data:{noAuth:true},templateUrl:'app/modules/global/profile/auth/register.html',controller:'RegisterController',controllerAs:'vm'}).state('app.profile',{url:'/profile',templateUrl:'app/modules/global/profile/edit/edit.html',controller:'ProfileController',controllerAs:'vm'});}})();