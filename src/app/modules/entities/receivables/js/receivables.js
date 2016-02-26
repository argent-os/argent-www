(function() {
  'use strict';

  angular.module('app.module.receivables', [])
    .controller('ReceivablesController', receivablesController);

  receivablesController.$inject = ['$http', '$rootScope', '$scope', '$state', '$location', '$window', 'notifications', 'UserFactory', 'appconfig', 'stripe'];
  function receivablesController($http, $rootScope, $scope, $state, $location, $window, notifications, UserFactory, config, stripe) {
 
    var vm = this;
    UserFactory.getProfile().then(function (response){
      $scope.showLoader = true;
      vm.user = response.data;
      response.data.stripeToken ? $rootScope.stripeConnected = true : $rootScope.stripeConnected = false;      
      vm.user.stripe.plan ? $scope.plan = vm.user.stripe.plan : $scope.plan = "No Plan";     
      if(vm.user.notificationsEnabled) {
          Notification.requestPermission();
      }
            $http({
              url: 'https://api.stripe.com/v1/balance',
              headers: {
                "Authorization": "Bearer " + response.data.stripeToken,
                "Content-Type": "application/x-www-form-urlencoded"              
              },
              method: "GET"
            }).then(function (res) {
                $scope.balanceInfo = res.data; 
                $scope.showLoader = false;            
            }, function (err) {
          vm.error = err.data.error.message;
          notifications.showError(vm.error);            
          console.log(err);
        })         
    });

  }

})();
