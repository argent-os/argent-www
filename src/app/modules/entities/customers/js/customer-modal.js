(function() {
  'use strict';

  angular.module('app.customer.modal', [])

  // Main application controller
  .controller('CustomerModalInstanceCtrl', ['$scope', '$http', 'UserFactory', '$modalInstance', 'notifications', 'appconfig',
    function ($scope, $http, UserFactory, $modalInstance, notifications, config) {

      var vm = this;
      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');            
      };

      $scope.addCustomer = function (token, firstname, lastname, email, description) {
        $scope.showLoader = true;
        $http({
          url: 'https://api.stripe.com/v1/customers',
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded"              
          },
          method: "POST",
          params: { "metadata[firstname]": firstname, "metadata[lastname]": lastname, email: email, description: description }
        }).then(function (res) {
            $scope.showLoader = false;
            // $scope.response=res.data;
            // $scope.customers=$scope.response.data;
            notifications.showSuccess('Customer Created');
            $modalInstance.dismiss();                  
        }, function (err) {
          vm.error = err.data.error.message;
          notifications.showError(vm.error + ' | Please try reconnecting your stripe account.');            
          console.log(err);
        })                        
      };              
  }])
})();
