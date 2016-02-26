(function() {
  'use strict';

  angular
    .module('app.core')
    .controller('App', AppController);

  AppController.$inject = ['coreConfig', 'notifications', 'notificator', '$http', '$state', '$location', '$window', '$rootScope', '$scope', 'shortHistory', 'AuthTokenFactory', 'UserFactory', 'OrganizationFactory', 'appconfig'];
  function AppController(coreConfig, notifications, notificator, $http, $state, $location, $window, $rootScope, $scope, shortHistory, AuthTokenFactory, UserFactory, OrganizationFactory, config) {
    /*jshint validthis: true */
    var vm = this;
    var store = $window.localStorage;
    vm.title = coreConfig.appTitle;

    $rootScope.app = coreConfig;
    $rootScope.$state = $state;
    $rootScope.$location = $location;
    $rootScope.$window = $window;

    $rootScope.hoverIn = function(){
      this.hoverEdit = true;
    };

    $rootScope.hoverOut = function(){
      this.hoverEdit = false;
    };
    
    $rootScope.$on('$stateChangeStart', function(event) {
    });

    $rootScope.showHelp = function() {
          $rootScope.showHelper=true;
    };

    $rootScope.stopHelp = function() {
          $rootScope.showHelper=false;
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      // $('body').toggleClass('nav-shown', false); //TODO: change later
    });

    $rootScope.date = Date.now();
    var time = Date.parse(store.getItem('timestamp'));    
    // Clear localstorage on timestamp expiry
    if(time) {
      if (time < Date.now()) {
          localStorage.removeItem('satellizer_token');
          localStorage.removeItem('auth-token');
          localStorage.removeItem('timestamp');
          localStorage.removeItem('user');
      }
    }

    if(!AuthTokenFactory.getToken() || !$rootScope.user) {
      $rootScope.stylePath = 'app/style/css/css_default/index_default.css';      
    }

    $rootScope.$on('$userSet', function(event) {
      if(AuthTokenFactory.getToken()) {
              var loadUser = function()
                  {
                      return UserFactory
                              .getProfile()
                              .then(function(response)
                              {
                                  vm.user = response.data;
                                  $rootScope.user = response.data;
                                  $rootScope.user = response.data;
                                  response.data.picture !== undefined ? $rootScope.profilePicSecureUrl == response.data.picture : $rootScope.profilePicSecureUrl = 'app/img/user.jpg';
                                  response.data.theme !== undefined ? $rootScope.userTheme = response.data.theme : $rootScope.userTheme = 1;
                                  response.data.stripeToken ? $rootScope.stripeConnected = true : $rootScope.stripeConnected = false;                   
                                  response.data.darkThemeEnabled ? $rootScope.stylePath = 'app/style/css/css_inverse/index_inverse.css' : $rootScope.stylePath = 'app/style/css/css_default/index_default.css';
                                  response.data.darkThemeEnabled ? $rootScope.circleBg = 'rgba(255,255,255,0.1)' : $rootScope.circleBg = 'rgba(255,255,255,0.1)';                                  
                                  response.data.darkThemeEnabled ? $rootScope.circleColor = 'white' : $rootScope.circleColor = 'white';  
                                  if(response.data.theme == "0") {
                                    $rootScope.circleBg = 'rgba(255,255,255,0.5)';
                                    $rootScope.circleColor = '#39BE97'; 
                                  }                                        
                                  return response;
                              });
                  },
                  loadOrganization = function(user)
                  {
                      if(user.data.orgId) {
                        return OrganizationFactory
                                .getOrganization(user)
                                .then(function(response)
                                {
                                    vm.organization = response;
                                    $rootScope.organization = response;
                                    return response;
                                });
                      }
                  }
              loadUser().then(loadOrganization);

              $rootScope.user = null;
              $rootScope.organization  = null;
      }
    });

    if(AuthTokenFactory.getToken()) {
          var loadUser = function()
              {
                  return UserFactory
                          .getProfile()
                          .then(function(response)
                          {
                              vm.user = response.data;
                              $rootScope.user = response.data;
                              response.data.picture !== undefined ? $rootScope.profilePicSecureUrl == response.data.picture : $rootScope.profilePicSecureUrl = 'app/img/user.jpg';                              
                              response.data.theme !== undefined ? $rootScope.userTheme = response.data.theme : $rootScope.userTheme = 1;                       
                              response.data.darkThemeEnabled ? $rootScope.stylePath = 'app/style/css/css_inverse/index_inverse.css' : $rootScope.stylePath = 'app/style/css/css_default/index_default.css';
                              response.data.darkThemeEnabled ? $rootScope.circleBg = 'rgba(255,255,255,0.1)' : $rootScope.circleBg = 'rgba(255,255,255,0.1)';
                              response.data.darkThemeEnabled ? $rootScope.circleColor = 'white' : $rootScope.circleColor = 'white';
                              if(response.data.theme == "0") {
                                $rootScope.circleBg = 'rgba(255,255,255,0.5)';
                                $rootScope.circleColor = '#39BE97'; 
                              }                                      
                              return response;
                          });
              },
              loadOrganization = function(user)
              {
                  if(user.data.orgId !== 'none' || user.data.orgId) {
                    return OrganizationFactory
                            .getOrganization(user)
                            .then(function(response)
                            {
                                vm.organization = response;
                                $rootScope.organization = response;
                                return response;
                            }, function (err) {
                              // console.log(err);
                              return err;
                            });
                  } else {
                    return null;
                  }
              }
          loadUser().then(loadOrganization);

          $rootScope.user = null;
          $rootScope.organization  = null;
    }

    UserFactory.authorize($location, $window);

    $rootScope.bgcolor = 'white';
    // $rootScope.switchTheme = function(user) {
    //   user.darkThemeEnabled ? $rootScope.stylePath = 'app/style/css/css_inverse/index_inverse.css' : $rootScope.stylePath = 'app/style/css/css_default/index_default.css';
    //   user.darkThemeEnabled = !user.darkThemeEnabled;
    //   $http.put(config.apiRoot + '/v1/profile/', {
    //       user: user,
    //       darkThemeEnabled: user.darkThemeEnabled
    //   }).success(function(data) {
    //     notificator.info('Please save your changes!');
    //     $state.go('app.editprofile');
    //   });
    // };

    $rootScope.chooseTheme = function (num) {
      notificator.info('Please save your changes!');
      $state.go('app.editprofile');      
      $rootScope.themeSelected = num;
      $rootScope.themeCss = 'app/style/css/themes/' + num + '.css'
      console.log($rootScope.themeCss);
    }

    $rootScope.themeSwap = function(user) {
      user.darkThemeEnabled ? $rootScope.stylePath = 'app/style/css/css_inverse/index_inverse.css' : $rootScope.stylePath = 'app/style/css/css_default/index_default.css';
    };
    shortHistory.init($scope);
  }

})();