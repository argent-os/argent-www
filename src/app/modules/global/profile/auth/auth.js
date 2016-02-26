(function() {
  'use strict';

  angular.module('app.profile')
    .controller('LoginController', loginController)
    .controller('RegisterController', registerController)
    .controller('PasswordController', passwordController)
    .controller('VerifyController', verifyController)
    .run(runAuth);

  loginController.$inject = ['UserFactory', '$scope', '$rootScope', '$window', 'appconfig', 'notifications'];
  function loginController(UserFactory, $scope, $rootScope, $window, config, notifications) {
    $rootScope.$broadcast('$userInit');    
    var store = $window.localStorage;
    var vm = this;
    var ref = new Firebase(config.firebaseUrl);
    vm.user = {};
    vm.responseErrorMsg = '';
    // $rootScope.stylePath = 'app/style/css/css_default/index_default.css';

    $scope.oauth = function(provider) {
      store.clear();
      UserFactory.oauth(provider).then(
        function(response) {
          vm.user = response.data.user; 
        }, 
        function(err) {
          console.log(err);
          vm.responseErrorMsg = 'Error logging in';
        });      
    };

    vm.login = function(email, password) {
      store.clear();
      $scope.showLoader=true;
      UserFactory.login(email,password).then(
        function(response) {
          $scope.showLoader=false;          
          ref.authWithCustomToken(response.data.auth.token, function(error, authData) {
            if (error) {
              // console.log("Authentication Failed!", error);
            } else {
              // console.log("Authenticated successfully with payload:", authData);
            }
          });                   
          vm.user = response.data.user; 
        }, 
        function(err) {
            $scope.showLoader=false;          
            if(err.data.message && err.statusText) {
                notifications.showError(err.statusText + ': ' + err.data.message);
                // swal({type:'error',title:err.statusText ,animation:false,text:err.data.message})              
            } else {
                notifications.showError('Error logging in');              
                // swal({type:'error',title:'Error' ,animation:false,text:'Error logging in'})              
            }
        });
    }
  }
  registerController.$inject = ['UserFactory', 'organizationResource', '$scope', '$rootScope', '$http', 'appconfig', 'notifications'];
  function registerController(UserFactory, organizationResource, $scope, $rootScope, $http, config, notifications) {
    var vm = this;
    vm.user = {};
    vm.responseErrorMsg = '';
    var ref = new Firebase(config.firebaseUrl);

    $scope.roles = [
      { title: 'admin',     enabled: true },
      { title: 'manager',   enabled: true },
      { title: 'contractor', enabled: true },
      { title: 'customer',  enabled: true },
      { title: 'supplier',  enabled: true },      
      { title: 'employee',  enabled: true }
    ];

    vm.register = function(username, email, password, role) {
      $scope.flag = true;
      $scope.showLoader=true;
      username = vm.user.username;
      email = vm.user.email;
      password = vm.user.password;
      role = $scope.roles;      
      UserFactory.register(username, email, password, role)
        .then(function(response) {
          ref.authWithCustomToken(response.data.auth.token, function(error, authData) {
            if (error) {
              // console.log("Authentication Failed!", error);
              notifications.showError('Error: ' + error);                                        
              $scope.flag=false;
              $scope.showLoader=false;              

            } else {
              $scope.flag=false;
              $scope.showLoader=false;              
              // console.log("Authenticated successfully with payload:", authData);
              swal({   title: "Account Created",   text: "Check your email to verify your account!",   
                type: "success",   
                showCancelButton: false,  
                closeOnCancel: true, 
                closeOnConfirm: true,  
                showLoaderOnConfirm: true, 
                confirmButtonText: "Close" 
              })  
              }
          });             
        }, 
        function(err) {
          // console.log(err);
          if(!!err.data.message) {
                $scope.flag=false;  
                $scope.showLoader=false;                                        
                notifications.showError(err.data.message);                          
          } else {
                $scope.flag=false;    
                $scope.showLoader=false;                                      
                notifications.showError('Error registering account');                          
          }
        });
    }
  }

  passwordController.$inject = ['UserFactory', '$scope', 'notifications'];
  function passwordController(UserFactory, $scope, notifications) {
    var vm = this;
    vm.user = {};
    vm.responseErrorMsg = '';

    vm.remindPassword = function(email) {
      email = vm.user.email;
      UserFactory.remindPassword(email)
        .then(
        function(response) {
          if(response.data.msg == 'new_password_sent') {
              // notifications.showSuccess('Password reset link sent');                          
          } else {
              notifications.showError('Error sending password');                          
              // swal({   title: "Error",   text: "Could not send password",   type: "error",   confirmButtonText: "Close" });                                        
          }          
          // location.reload();
          // console.log(response);
        }, 
        function(err) {
          // console.log(err);
          if(err.data[0].msg) {
            notifications.showError(err.data[0].msg);                          
            // swal({   title: "Error",   text: "Could not send password",   type: "error",   confirmButtonText: "Close" });       
          } else {
            notifications.showError('Could not send password');                          
          }                                           
          // vm.responseErrorMsg = err.data.message;
        });
    };

    vm.resetPassword = function(password) {
      // console.log('resetting');
      var _password = password;
      UserFactory.resetPassword(_password)
        .then(function(response) {
          if(response.data.msg == 'new_password_success') {
              // swal({   title: "Success",   text: "Password is reset",   type: "success",   confirmButtonText: "Close" });
              notifications.showSuccess('Password reset');                                                          
          } else {
              notifications.showError('Error resetting password');                          
              // swal({   title: "Error",   text: "Could not reset password",   type: "error",   confirmButtonText: "Close" });                                        
          }          
          // location.reload();
          // console.log(response);
        }, 
        function(err) {
          // console.log(err);
          if(err) {
            notifications.showError('Error resetting password');                          
            // swal({   title: "Error",   text: "Could not send password",   type: "error",   confirmButtonText: "Close" });       
          }                                           
          vm.responseErrorMsg = err.data.message;
        });
    }    
  }  

  verifyController.$inject = ['UserFactory', 'AuthTokenFactory', 'organizationResource', '$state', '$rootScope', '$scope', '$location', '$http', 'appconfig', 'notifications'];
  function verifyController(UserFactory, AuthTokenFactory, organizationResource, $state, $rootScope, $scope, $location, $http, config, notifications) {
    var vm = this;
    $scope.verifyText = "Verifying";
    $scope.showLoader = true;
    vm.user = {};
    vm.responseErrorMsg = '';
    // if the verify token is equal to the token given to user at signup, post a successfully verified response to the user profile
        $scope.verifyToken = $location.search().token; 
        UserFactory.getProfile().then(function (res) {
            var user = res.data;
            // console.log(user);
            //put if statement here
            $http.put(config.apiRoot + '/v1/profile', {
              user: user,
              verifyToken: "",
              verified: true
            })
            .success(function(data) {
                // console.log(data);
                $scope.verifyText = "Account Verified";
                $scope.showLoader = false;
                swal({   title: "Verified",   
                   text: "Your email has been verified",   
                   type: "success",   
                   showCancelButton: false,   
                   confirmButtonColor: "#2ECC71",   
                   confirmButtonText: "Go to app",   
                   closeOnConfirm: false,   
                   showLoaderOnConfirm: false         
                 }, function() {
                    $rootScope.user.verified = true;
                    $state.go('app.dashboard');  
                        swal({   title: "Organization",   text: "Let's set up an organization (company) first",   
                          type: "input",   
                          imageUrl: "app/img/org.png",                
                          showCancelButton: false,  
                          closeOnCancel: false, 
                          closeOnConfirm: false,  
                          showLoaderOnConfirm: true, 
                          inputPlaceholder: "Organization name",
                          confirmButtonText: "Create" 
                        }, function(inputValue){   
                            if (inputValue === false) return false;      
                            if (inputValue === "" || inputValue == null || inputValue == undefined) {     
                              swal.showInputError("An organization must be entered to continue");     
                              return false;
                            }   
                              var _date = (new Date()).toISOString();
                              organizationResource.save({date:_date, name:inputValue}, function (response) {
                                $rootScope.orgFound = true; 
                                $rootScope.organization = response.organization;
                                vm.organization = response.organization;
                              }).$promise.then(
                                function(data){
                                  UserFactory.getProfile().then(function (userinfo) {
                                    var _user = userinfo.data;
                                    // console.log(user);
                                    $http.put(config.apiRoot + '/v1/profile', {
                                      user: _user,
                                      orgId: data.organization._id,
                                      verified: true
                                    })
                                    .success(function(response) {
                                        $rootScope.orgFound = true;    
                                        swal({   title: "Success",   text: 'Organization created!',   type: "success",   confirmButtonText: "Continue" });                                                      
                                        notifications.showSuccess('Profile changes saved')
                                    })
                                    .error(function(err) {
                                        $rootScope.orgFound = false;                                
                                        vm.responseErrorMsg = err.data.message;                                                                             

                                    });               
                                  })       
                                },
                                function(err){
                                      $rootScope.orgFound = true;                            
                                      vm.responseErrorMsg = err.data.message;     
                                }
                              )                  
                            }
                          ) 
                 }); 
            })
            .error(function(err) {
              if(err.message) {
                notifications.showError(err.message);                              
              }
              notifications.showError('Error occured');                            
              // vm.responseErrorMsg = err.message;
            });                              
        })

  }  

  runAuth.$inject = ['$rootScope', '$state', 'UserFactory', '$location'];
  function runAuth($rootScope, $state, UserFactory, $location) {
    $rootScope.logout = UserFactory.logout;
    $rootScope.userLoggedIn = false;
    $rootScope.$on('$userLoggedIn', function() {
      $rootScope.$broadcast('$userSet');
      $rootScope.userLoggedIn = true;      
      $state.go('app.dashboard');
      $location.url('/app/dashboard');
    });
    $rootScope.$on('$userLoggedOut', function() {
      $location.url('/login');      
      $state.go('login');
      $rootScope.userLoggedIn = false;      
      $rootScope.user = '';
      $rootScope.organization = '';
      $rootScope.orgFound = '';
      $rootScope.stripeConnected = '';      
    });  
  }
})();
