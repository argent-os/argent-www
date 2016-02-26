(function() {
  'use strict';

  angular.module('app.rb.modal', [])

  // Main application controller
  .controller('RbModalInstanceCtrl', ['$scope', '$http', 'UserFactory', '$modalInstance', 'items', 'customer', 'notifications', 'appconfig',
    function ($scope, $http, UserFactory, $modalInstance, items, customer, notifications, config) {

      var vm = this;
      (function() {
        function init(user) {
            vm.user=user;
            $scope.customer = customer;
            $scope.user = user;
            $scope.items = items;
            $scope.selected = {
              item: $scope.items[0]
            };

            $scope.ok = function () {
              $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');            
            };

            $scope.addCustomer = function (token, email, description) {
              $scope.showLoader = true;
              $http({
                url: 'https://api.stripe.com/v1/customers',
                headers: {
                  "Authorization": "Bearer " + token,
                  "Content-Type": "application/x-www-form-urlencoded"              
                },
                method: "POST",
                params: { email: email, description: description }
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
            $scope.addRecurringBilling = function (token, plan) {
              //customer info passed in when modal opened
              $scope.showLoader = true;
              $http({
                url: 'https://api.stripe.com/v1/customers/' + customer.id + '/subscriptions',
                headers: {
                  "Authorization": "Bearer " + token,
                  "Content-Type": "application/x-www-form-urlencoded"              
                },
                method: "POST",
                params: { plan: plan }
              }).then(function (res) {
                  $scope.showLoader = false;
                  // $scope.response=res.data;
                  // $scope.customers=$scope.response.data;
                  notifications.showSuccess('Customer will be recurringly billed for ' + plan + ' plan');
                  $modalInstance.dismiss();                  
              }, function (err) {
                vm.error = err.data.error.message;
                notifications.showError(vm.error);            
              })                        
            };                 
        };  
        UserFactory.getProfile().then(function (res) {
          init(res.data);
        });
      })();  

  }])
})();
