(function() {
  'use strict';

  var module = angular.module('app.images', ['ui.router', 'ngResource', 'app.resource', 'app.common',  'photoAlbumControllers',
  'photoAlbumServices', 'cloudinary']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.images', {
        url: '/images/',
        templateUrl: 'app/modules/global/images/partials/photo-list.html',
        resolve: {
          photoList: function($q, $rootScope, album) {
            if (!$rootScope.serviceCalled) {
              return album.photos({}, function(v){
                $rootScope.serviceCalled = true;
                $rootScope.photos = v.resources;
              });
            } else {
              return $q.state(true);
            }
          }
        }        
      })
      .state('app.uploadimage', {
        url: '/images/upload/',
        templateUrl: 'app/modules/global/images/partials/photo-upload.html',
        controller: 'photoUploadCtrl',
        controllerAs: 'vm'
      });
  }
})();
