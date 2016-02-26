(function(){'use strict';angular.module('app.common').service('shortHistory',shortHistory).factory('AuthTokenFactory',AuthTokenFactory).factory('UserFactory',UserFactory);shortHistory.$inject=['$state'];function shortHistory($state){var history=this;function setItem(what,state,params){history[what]={state:state,params:params};}this.init=function(scope){scope.$on('$stateChangeSuccess',function(event,toState,toParams,fromState,fromParams){setItem('from',fromState,fromParams);setItem('to',toState,toParams);});};this.goTo=function(where){$state.go(history[where].state.name,history[where].params)};}AuthTokenFactory.$inject=['$window'];function AuthTokenFactory($window){'use strict';var store=$window.localStorage;var key='auth-token';return{getToken:getToken,setToken:setToken};function getToken(){return store.getItem(key);}function setToken(token){if(token){store.setItem(key,token);var time=new Date();time.setMinutes(time.getMinutes()+60);store.setItem('timestamp',time);}else{store.removeItem(key);}}}UserFactory.$inject=['$http','$rootScope','AuthTokenFactory','$q','$location','$window','$auth'];function UserFactory($http,$rootScope,AuthTokenFactory,$q,$location,$window,$auth){'use strict';var vm=this;var store=$window.localStorage;vm.login=login;vm.oauth=oauth;vm.logout=logout;vm.authorize=authorize;vm.register=register;vm.getProfile=getProfile;vm.token=AuthTokenFactory.getToken();return{login:login,oauth:oauth,logout:logout,authorize:authorize,register:register,getProfile:getProfile};function login(email,password){return $http.post('/api/v1/login',{email:email,password:password}).then(function success(response){AuthTokenFactory.setToken(response.data.token);$rootScope.$broadcast('$userLoggedIn');$rootScope.$broadcast('$userSet');return response;});}function oauth(provider){return $auth.authenticate(provider).then(function success(response){AuthTokenFactory.setToken(response.data.token);if(response.data.token){$rootScope.$broadcast('$userLoggedIn');$rootScope.$broadcast('$userSet');$location.$$path='/app/dashboard';}return response;});}function authorize($location,$window){if($window.location.href.indexOf('login')!==-1){localStorage.clear();}if(vm.token){if($window.location.href.indexOf('login')!==-1){$location.$$path='/app/dashboard';}}else{$location.$$path='/login';}}function logout(){AuthTokenFactory.setToken();store.clear();$auth.logout();$auth.removeToken();$rootScope.$broadcast('$userLoggedOut');}function register(email,password,role){return $http.post('/api/v1/register',{email:email,password:password,role:role}).then(function success(response){AuthTokenFactory.setToken(response.data.token);$rootScope.$broadcast('$userLoggedIn');$rootScope.$broadcast('$userSet');return response;});}function getProfile(){if(AuthTokenFactory.getToken()){return $http.get('/api/v1/profile').then(function success(response){return response;});}else{return $q.reject({data:'client has no auth token'});}}};})();