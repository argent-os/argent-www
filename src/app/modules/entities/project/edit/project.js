(function() {
  'use strict';

  angular
    .module('app.module.project', [])
    .controller('ProjectController', projectController);

  projectController.$inject = ['$scope', '$rootScope', '$http', '$window', 'UserFactory', 'organizationResource', 'OrganizationFactory', '$state', 'shortHistory', 'notifications', 'appconfig'];
  function projectController($scope, $rootScope, $http, $window, UserFactory, organizationResource, OrganizationFactory, $state, shortHistory, notifications, config) {
    var vm = this;
    var store = $window.localStorage;        
    // console.log(vm.organization);

    $scope.project = $state.params.name;
    $scope.task = $state.params.name;

    vm.showReturnBtn = vm.organization; //&& shortHistory.from.state.name;
    vm.update = function() {
      swal({   title: "Warning",   
         text: "Updating the name of an organization will delete all team and organization related information",   
         type: "warning",   
         showCancelButton: true,   
         confirmButtonColor: "#2ECC71",   
         confirmButtonText: "Yes, update it",   
         cancelButtonText: "No, cancel",   
         closeOnConfirm: false,   
         closeOnCancel: false,
         showLoaderOnConfirm: true         
       }, 
         function(isConfirm){   
            if (isConfirm) {     
              vm.organization.date = (new Date()).toISOString();
              organizationResource.update(vm.organization, function(o) {
                $rootScope.orgFound = true;
                $rootScope.organization = vm.organization;
                $state.go('app.organization');
                swal("Updated!", "Your organization has been updated.", "success");   
              });
            } else {     
              swal("Cancelled", "Operation cancelled", "info");   
            } 
         });           
    };

    vm.return = function() {
        $state.go(shortHistory.from.state.name, shortHistory.from.params);
    };

    vm.save = function() {
      vm.organization.date = (new Date()).toISOString();
      organizationResource.save($rootScope.organization, function() {
        console.log(vm.organization);
        store.setItem('vm.organization', JSON.stringify(vm.organization));        
        $state.go('app.organization');
        notifications.showSuccess('Organization saved')
      }).$promise.then(
        function(data){
          UserFactory.getProfile().then(function (userinfo) {
            var _user = userinfo.data;
            // console.log(user);
            $http.put(config.apiRoot + '/v1/profile', {
              user: _user,
              orgId: data.organization._id
            })
            .success(function(response) {
                $rootScope.orgFound = true;              
                // notifications.showSuccess('Profile changes saved')
            })
            .error(function(err) {
              if(err.data) {               
                swal({   title: "Error",   text: err.data.message,   type: "error",   confirmButtonText: "Close" });                                                      
              }
            });               
          })       
        },
        function(err){
          if(err.data) { 
            swal({   title: "Error",   text: err.data.message,   type: "error",   confirmButtonText: "Close" });                                                                
          }     
          // console.log(err);
        }
      )
    };

    vm.delete = function(org) {
      swal({   title: "Are you sure?",   
         text: "You will not be able to recover this organization",   
         type: "warning",   
         showCancelButton: true,   
         confirmButtonColor: "#DD6B55",   
         confirmButtonText: "Yes, delete it",   
         cancelButtonText: "No, cancel",   
         closeOnConfirm: false,   
         closeOnCancel: false,
         showLoaderOnConfirm: true         
       }, 
         function(isConfirm){   
            if (isConfirm) {     
              var _org = org;
              $rootScope.organization = ''; 
              $rootScope.organizationDoesNotExist = true;       
              UserFactory.getProfile().then(function (userinfo) {
                var _user = userinfo.data;
                // console.log(user);
                $http.put(config.apiRoot + '/v1/profile', {
                  user: _user,
                  orgId: ''
                }).success(function (response) {
                  console.log(response);
                  organizationResource.delete(_org, function(o) {
                    $state.go('app.dashboard');
                    swal("Deleted!", "Your organization has been deleted.", "success");   
                  });
                })                  
              })    
            } else {     
              swal("Cancelled", "Operation cancelled", "info");   
            } 
         });      
      
    };   
  }

})();
