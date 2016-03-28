(function(){'use strict';angular.module('app.organization').controller('OrganizationController',organizationController);organizationController.$inject=['data','$http','UserFactory','organizationResource','$state','shortHistory','notificator'];function organizationController(data,$http,UserFactory,organizationResource,$state,shortHistory,notificator){var vm=this;vm.organization=data;vm.showReturnBtn=vm.organization;vm.get=function(){}
vm.update=function(){vm.organization.date=(new Date()).toISOString();organizationResource.update(vm.organization,function(o){shortHistory.goTo('from');notificator.success('Organization was successfully updated')});};vm.return=function(){$state.go(shortHistory.from.state.name,shortHistory.from.params);};vm.save=function(){vm.organization.date=(new Date()).toISOString();organizationResource.save(vm.organization,function(){shortHistory.goTo('from');notificator.success('Organization was successfully saved')}).$promise.then(function(orginfo){UserFactory.getProfile().then(function(userinfo){var user=userinfo.data;console.log(user);$http.put('/api/v1/profile',{user:user,orgId:orginfo.organization._id}).success(function(data){}).error(function(err){});})},function(err){console.log(err);})};vm.delete=function(){organizationResource.delete(vm.organization,function(o){shortHistory.goTo('from');notificator.success('Organization was successfully deleted')});};}})();