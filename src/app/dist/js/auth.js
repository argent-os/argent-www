(function(){'use strict';angular.module('app.profile').controller('LoginController',loginController).controller('RegisterController',registerController).run(runAuth);loginController.$inject=['UserFactory','$scope','$rootScope','$window'];function loginController(UserFactory,$scope,$rootScope,$window){var store=$window.localStorage;var vm=this;vm.user={};vm.responseErrorMsg='';$scope.oauth=function(provider){store.clear();UserFactory.oauth(provider).then(function(response){store.setItem('user',JSON.stringify(response.data.user));},function(err){vm.responseErrorMsg='Error logging in';});};vm.login=function(email,password){store.clear();UserFactory.login(email,password).then(function(response){store.setItem('user',JSON.stringify(response.data.user));},function(err){vm.responseErrorMsg='Error logging in';});}}registerController.$inject=['UserFactory','$scope'];function registerController(UserFactory,$scope){var vm=this;vm.user={};vm.responseErrorMsg='';$scope.roles=[{title:'admin',enabled:true},{title:'manager',enabled:true},{title:'contractor',enabled:true},{title:'customer',enabled:true},{title:'supplier',enabled:true},{title:'employee',enabled:true}];vm.register=function(email,password,role){email=vm.user.email;password=vm.user.password;role=$scope.roles;UserFactory.register(email,password,role).then(function(success){console.log(success);},function(err){console.log(err);vm.responseErrorMsg=err.data;});}}runAuth.$inject=['$rootScope','$state','UserFactory'];function runAuth($rootScope,$state,UserFactory){$rootScope.logout=UserFactory.logout;$rootScope.$on('$userLoggedIn',function(){$state.go('app.dashboard');});$rootScope.$on('$userLoggedOut',function(){$state.go('login');});}})();