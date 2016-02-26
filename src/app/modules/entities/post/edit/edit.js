(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('PostController', postController);

  postController.$inject = ['data', 'postResource', '$state', 'shortHistory', 'notificator'];
  function postController(data, postResource, $state, shortHistory, notificator) {
    var vm = this;
    vm.post = data;
    vm.showReturnBtn = vm.post; //&& shortHistory.from.state.name;
    vm.get = function() {
      postResource.get(vm.post, function(p) {
        notificator.success('Post was successfully retrieved')
      });
    }
    vm.update = function() {
      vm.post.date = (new Date()).toISOString();
      postResource.update(vm.post, function(p) {
        shortHistory.goTo('from');
        notificator.success('Post was successfully updated')
      });
    };

    vm.return = function() {
        $state.go(shortHistory.from.state.name, shortHistory.from.params);
    };

    vm.save = function() {
      vm.post.date = (new Date()).toISOString();
      postResource.save(vm.post, function(savedPost) {
        shortHistory.goTo('from');
        notificator.success('Post was successfully saved')
      });
    };

    vm.delete = function() {
      postResource.delete(vm.post, function(p) {
        shortHistory.goTo('from');
        notificator.success('Post was successfully deleted')
      });
    };
  }

})();
