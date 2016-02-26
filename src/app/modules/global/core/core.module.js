(function() {
  'use strict';

  var core = angular.module('app.core', [
    /*
     * Angular modules
     */
    'ngResource',
    'ui.router',
    'ngAnimate',
    'toastr',
    'satellizer'
  ]).filter('num', function() {
      return function(input) {
        return parseInt(input, 10);
      }
  });

  core.config(appConfig);
  core.config(httpConfig);
  core.config(oAuthConfig);


  oAuthConfig.$inject = ['$authProvider'];
  function oAuthConfig($authProvider) {
    // Generic OAuth 2.0
    // $authProvider.oauth2({
    //   name: null,
    //   url: null,
    //   clientId: null,
    //   redirectUri: window.location.origin + '/',
    //   authorizationEndpoint: null,
    //   defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
    //   requiredUrlParams: null,2
    //   optionalUrlParams: null,
    //   scope: ['password'],
    //   scopePrefix: null,
    //   scopeDelimiter: ',',
    //   state: null,
    //   type: '2.0',
    //   popupOptions: null,
    //   responseType: 'code',
    //   responseParams: {
    //     code: 'code',
    //     clientId: 'clientId',
    //     redirectUri: 'redirectUri'
    //   },
    //   requiredUrlParams: ['display', 'scope'],
    //   display: 'popup',
    //   popupOptions: { width: 580, height: 400 }      
    // });
  };

  httpConfig.$inject = ['$provide', '$httpProvider'];
  function httpConfig($provide, $httpProvider) {
    $provide.factory('AuthInterceptor', ['$q', '$location', 'AuthTokenFactory', 
      function($q, $location, AuthTokenFactory) {
        return {
          request: function(config) {
            var token = AuthTokenFactory.getToken();
            // swap out authorization header in case of cloudinary or stripe calls (slack in the future)
            if (token && config.url.indexOf('api.cloudinary.com')===-1 && config.url.indexOf('api.stripe.com')===-1) {
              config.headers = config.headers || {};
              config.headers.Authorization = 'Bearer ' + token;
            }
            return config || $q.when(config);
          },
          requestError: function(rejection) {
            return $q.reject(rejection);
          },
          response: function(response) {
            return response || $q.when(response);
          },
          responseError: function(rejection) {
            return $q.reject(rejection);
          }
        };
    }]);
    $httpProvider.interceptors.push('AuthInterceptor');
  };

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
  function appConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/modules/global/core/app.html'
      });

    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get('$state');
          $state.go('login');
    });
  }
})();
