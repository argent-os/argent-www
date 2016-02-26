(function() {
  'use strict';

  var module = angular.module('app.post', ['ui.router', 'ngResource', 'app.resource', 'app.common']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.posts', {
        url: '/posts/:id',
        templateUrl: 'app/modules/entities/post/list/posts.html',
        resolve: {
          posts: ['$stateParams', 'postsUtils', 'postResource', '$http', function($stateParams, postsUtils, postResource, $http) {
            return postResource.query().$promise.then(function(allPosts) {
              // return $stateParams.interval ? postsUtils.postsDuringInterval(allPosts, $stateParams.interval) : allPosts;
              return allPosts;
            });
          }]
        },
        controller: 'PostListController',
        controllerAs: 'vm'
      })
      .state('app.editPost', {
        url: '/posts/edit/:id',
        templateUrl: 'app/modules/entities/post/edit/edit.html',
        resolve: {
          data: ['$stateParams', 'postResource', function($stateParams, postResource){
            return $stateParams.id ? postResource.get({id:$stateParams.id}).$promise : {};
          }]
        },
        controller: 'PostController',
        controllerAs: 'vm'
      });
  }
})();
