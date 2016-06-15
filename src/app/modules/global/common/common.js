(function() {
  'use strict';

  angular.module('app.common')
    .service('shortHistory', shortHistory)
    .factory('AuthTokenFactory', AuthTokenFactory)
    .factory('UserFactory', UserFactory);
  shortHistory.$inject = ['$state'];
  function shortHistory($state) {
    var history = this;

    function setItem(what, state, params) {
      history[what] = {
        state: state,
        params: params
      };
    }

    this.init = function(scope) {
      scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        setItem('from', fromState, fromParams);
        setItem('to', toState, toParams);
      });
    };

    this.goTo = function(where) {
      $state.go(history[where].state.name, history[where].params)
    };
  }

  AuthTokenFactory.$inject = ['$window'];
  function AuthTokenFactory($window) {
    'use strict';
    var store = $window.localStorage;
    var key = 'auth-token';

    return {
      getToken: getToken,
      setToken: setToken
    };

    function getToken() {
      return store.getItem(key);
    }

    function setToken(token) {
      if (token) {
        store.setItem(key, token);
        var time = new Date();
        time.setMinutes(time.getMinutes() + 60);
        store.setItem('timestamp', time);
      } else {
        store.removeItem(key);
      }
    }
  }

  UserFactory.$inject = ['$http', '$rootScope', 'AuthTokenFactory', '$q', '$location', '$window', '$auth', 'appconfig', 'notifications'];
  function UserFactory($http, $rootScope, AuthTokenFactory, $q, $location, $window, $auth, config, notifications) {
    'use strict';
    var vm = this;
    var store = $window.localStorage;

    vm.login = login;
    vm.oauth = oauth;
    vm.logout = logout;
    vm.authorize = authorize;
    vm.register = register;
    vm.remindPassword = remindPassword;
    vm.resetPassword = resetPassword;
    vm.getProfile = getProfile;
    vm.generateApiKey = generateApiKey;
    vm.token = AuthTokenFactory.getToken();

    return {
      login: login,
      oauth: oauth,
      logout: logout,
      authorize: authorize,
      register: register,
      resetPassword: resetPassword,
      remindPassword: remindPassword,
      getProfile: getProfile,   
      generateApiKey: generateApiKey    
    };

    function login(email, password) {
      return $http.post(config.apiRoot + '/v1/login', {
        email: email,
        password: password
      }).then(function success(response) {
        AuthTokenFactory.setToken(response.data.token);
        $rootScope.$broadcast('$userLoggedIn');
        $rootScope.$broadcast('$userSet');
        return response;
      });
    }

    function oauth(provider) {
      return $auth.authenticate(provider).then(
        function success(response) {
          AuthTokenFactory.setToken(response.data.token);
          if(response.data.token) {
            $rootScope.$broadcast('$userLoggedIn');
            $rootScope.$broadcast('$userSet');
            $location.$$path='/app/dashboard';            
          }
          return response;
        }, function (err) {
          console.log(err);
        });      
    }

    function authorize($location, $window) {
      if($window.location.href.indexOf('login')!==-1) {
          localStorage.clear();
      }      
      if(vm.token) {
        if($window.location.href.indexOf('login')!==-1) {
          $location.$$path='/app/dashboard';
        }
      } else {
        //console.log('user not logged in');
      }
    }

    function logout() {
      AuthTokenFactory.setToken();
      store.clear();
      $auth.logout();
      $auth.removeToken();
      $rootScope.$broadcast('$userLoggedOut');
      $rootScope.user = '';
      $rootScope.organization = '';
      $rootScope.orgFound = '';      
    }

    function register(username, email, password, role) {
      return $http.post(config.apiRoot + '/v1/register', {
        username:username,
        email:email,
        password: password,
        role: role
      }).then(function success(response) {
        AuthTokenFactory.setToken(response.data.token);
        $rootScope.$broadcast('$userLoggedIn');
        $rootScope.$broadcast('$userSet');
        return response;
      });
    }

    function remindPassword(email) {
      var remindUrl = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/reset';
      return $http.post(config.apiRoot + '/v1/remindpassword', {
        email: email,
        url: remindUrl
      }).then(function success(response) {
        console.log(response);
        if(response.data.status == 'success') {
            notifications.showSuccess('Password reset link sent');                        
            // swal({   title: "On the way",   text: "Password reset link sent",   type: "success",   confirmButtonText: "Close" });                              
        } else if(response.data.status == 'error') {
            notifications.showError('Error sending password reset link');                        
            // swal({   title: "Error",   text: "Could not send password",   type: "error",   confirmButtonText: "Close" });                                        
        }
        return response;
      });
    }

    function resetPassword(password) {
      var resetToken = $location.search().token;       
      return $http.post(config.apiRoot + '/v1/resetpassword', {
        token: resetToken,
        password: password
      }).then(function success(response) {
        console.log('resa', response);
        console.log(response);
        // if(response.data.msg == 'new_password_success') {
        //     swal({   title: "Success",   text: "Password is reset",   type: "success",   confirmButtonText: "Go to login" });                              
        // } else {
        //     swal({   title: "Error",   text: "Could not reset password",   type: "error",   confirmButtonText: "Close" });                                        
        // }
        return response;
      });
    }

    function getProfile() {
      if (AuthTokenFactory.getToken()) {
        return $http.get(config.apiRoot + '/v1/profile').then(function success(response) {
          return response;
        });
      } else {
        return $q.reject({ data: 'client has no auth token' });
      }
    } 

    function generateApiKey(user) {
      var vm = this;      
      if (AuthTokenFactory.getToken()) {
        $http.get(config.apiRoot + '/v1/apikey').then(function success(response) {
          $rootScope.apiKey = response.data.token;
          return response;
        });
      } else {
        return $q.reject({ data: 'client has no auth token' });
      }
    }     
  };

})();
