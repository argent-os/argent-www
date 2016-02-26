(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', profileController);

  profileController.$inject = ['$http', '$rootScope', '$scope', '$state', '$location', '$window', 'notifications', 'UserFactory', 'appconfig', 'stripe'];
  function profileController($http, $rootScope, $scope, $state, $location, $window, notifications, UserFactory, config, stripe) {
    $scope.roles = [
      { title: 'admin',     enabled: true },
      { title: 'manager',   enabled: true },
      { title: 'contractor', enabled: true },
      { title: 'customer',  enabled: true },
      { title: 'supplier',  enabled: true },
      { title: 'employee',  enabled: true }
    ];
    var vm = this;
    vm.responseErrorMsg = '';

    // Set up plaid
    var linkHandler = Plaid.create({
      env: 'tartan',
      clientName: 'Praxi',
      key: 'fb32b0520292ad69be7b4d1ade4bd3',
      product: 'auth',
      selectAccount: true,
      onSuccess: function(public_token, metadata) {
        // Send the public_token and account ID to your app server.
        console.log('public_token: ' + public_token);
        console.log('account ID: ' + metadata.account_id);
        console.log('Metadata: ' + metadata);
        $scope.plaidPublicToken = public_token;
        $scope.plaidAcctId = metadata;
        $scope.plaidMetadata = metadata;
        $scope.confirmPlaid = true;
      },
    });

    // Trigger the Link UI
    if(document.getElementById('linkButton')) {
      document.getElementById('linkButton').onclick = function() {
        linkHandler.open();
      }; 
    }

    // might need account id for plaid
    $scope.getPlaid = function() {
        $http({
          url: config.apiRoot + '/v1/plaid',
          method: "GET",
          params: { public_token: $scope.plaidPublicToken, account_id: $scope.plaidAcctId }
        }).then(function (res) {
            console.log(res); 
            $rootScope.plaidInfo = res.data; 
        }, function (err) {
          vm.error = err.data.error.message;
          notifications.showError(vm.error);            
          console.log(err);
        })  
    }

    UserFactory.getProfile().then(function (response){     
      $scope.showLoader = true;
      vm.user = response.data;
      response.data.stripeToken ? $rootScope.stripeConnected = true : $rootScope.stripeConnected = false;      
      vm.user.stripe.plan ? $scope.plan = vm.user.stripe.plan : $scope.plan = "No Plan";     
      if(vm.user.notificationsEnabled) {
          Notification.requestPermission();
      }
        $http({
          url: 'https://api.stripe.com/v1/accounts?limit=3',
          headers: {
            "Authorization": "Bearer " + response.data.stripeToken,
            "Content-Type": "application/x-www-form-urlencoded"              
          },
          method: "GET"
        }).then(function (res) {
            // console.log(res); 
            $scope.accountInfo = res.data; 
            $http({
              url: 'https://api.stripe.com/v1/customers/' + vm.user.stripe.customerId + '/sources?object=bank_account&limit=3',
              headers: {
                "Authorization": "Bearer " + response.data.stripeToken,
                "Content-Type": "application/x-www-form-urlencoded"              
              },
              method: "GET"
            }).then(function (res) {
                // console.log(res.data.data); 
                $scope.bankInfo = res.data.data; 
                $scope.showLoader = false;            
            });
        }, function (err) {
          vm.error = err.data.error.message;
          // notifications.showError(vm.error);            
          console.log(err);
        })         
    });

    $scope.generateApiKey = function(user) {
      UserFactory.generateApiKey(user);
    }

    $scope.toggleStripe = function(user, url) {
      var _user = user;
      if(!_user.stripeEnabled) {
        $http.put(config.apiRoot + '/v1/profile', {
          user: _user,
          stripeToken: '',
          stripeEnabled: false
        }).success(function(data) {
            $rootScope.stripeConnected = true;
            notifications.showSuccess('Stripe account disconnected');
            $state.go('app.integrations');
        })
        .error(function(err) {
        });            
      } else if(_user.stripeEnabled == null || _user.stripeEnabled || _user.stripeEnabled == undefined) {
        $window.location.href = url;        
      }
    }

    $scope.code = $location.search().code;
    if($scope.code !== undefined) {
      UserFactory.getProfile().then(function (res) {
        var _user = res.data;
        var _code = $location.search().code;
        $http({
          url: config.apiRoot + '/oauth/callback', 
          method: "GET",
          params: {code: _code}
        }).then(function (response) {
          if(response.data.stripeToken) {
            var _stripeData = JSON.parse(response.data.stripeData);
            $http.put(config.apiRoot + '/v1/profile', {
              user: _user,
              stripeData: _stripeData,
              stripeToken: response.data.stripeToken,
              stripeEnabled: true
            })
            .success(function(data) {
                $rootScope.stripeConnected = true;
                $state.go('app.profile');
                swal({   title: "Success",   text: "Stripe account connected!",   type: "success",   confirmButtonText: "Close",   timer: 4000 }); 
            })
            .error(function(err) {
                swal({   title: "Error",   text: "Error connecting to Stripe",   type: "error",   confirmButtonText: "Close" });                                                              
            });          
          }
        });         
      })
    } else {
      $scope.code = $location.search().code;
    }
    $scope.stripeInfo = function() {
      swal({   title: "What is Stripe?",   animation: false, text: "Stripe is the best way to accept payments online and in mobile apps. By connecting Stripe to your TimeKloud account, you can enable features such as invoicing and recurring billing.",   type: "info",   confirmButtonText: "Close"});       
    }
    
    $scope.manuallyConnectStripe = function (user, code) {
      var _user = user;
      var _code = code;
      $http({
        url: config.apiRoot + '/oauth/callback', 
        method: "GET",
        params: {code: _code}
      }).then(function (response) {
        if(response.data.stripeToken) {
          $http.put(config.apiRoot + '/v1/profile', {
            user: _user,
            stripeToken: response.data.stripeToken
          })
          .success(function(data) {
              $rootScope.stripeConnected = true;
              $state.go('app.profile');
              swal({   title: "Success",   text: "Stripe account connected!",   type: "success",   confirmButtonText: "Close",   timer: 4000 }); 
          })
          .error(function(err) {
              swal({   title: "Error",   text: "Error connecting to Stripe",   type: "error",   confirmButtonText: "Close" });                                                              
          });          
        }
      }); 
    }

    $scope.validateInput = function() {
      (function($) {
        $('#card-num').payment('formatCardNumber');

        var validateDetails = function() {
          // console.log('validating');
          // set variables for the expiry date validation, cvc validation and expiry date 'splitter'
          var cardNum = $('#card-num');
          var validateNumber = $.payment.validateCardNumber(cardNum.val());
          if (validateNumber) {
            // if the cvc is valid add the identified class
            cardNum.closest('.form-group').addClass('has-success').removeClass('has-error');
          } else {
            // remove again if the cvc becomes invalid
            cardNum.closest('.form-group').addClass('has-error').removeClass('has-success');
          }

        }
        // this runs the above function every time stuff is entered into the card inputs
        $('.paymentInput').bind('change paste keyup', function() {
          validateDetails();
        });     
      }(jQuery));
    }
    vm.updateBilling = function (cardNum, cardMonth, cardYear, cardCVC) {
      $scope.payment = {
          card : {
            number : cardNum,
            cvc  : cardCVC,
            exp_month : cardMonth,
            exp_year  : cardYear
          }
      };            
      (function($) {
        var cardWrapper = $('#cardWrapper'),
        cardForm = $('#cardForm'),
        formError = $('#cardFormError'),
        cardFormBtnUpdate = $('#updatecardbutton'),
        cardFormBtnAdd = $('#addcardbutton');

        if(cardWrapper.length > 0){
          $("input[name=plan]:radio").change(function (e) {
            if(this.value == 'free'){
              cardWrapper.hide();
            } else {
              cardWrapper.show();
            }
          });
          if($("input:radio[name=plan]:checked").val() == 'free'){
            cardWrapper.hide();
          }
        }

        // cardForm.submit(function(e) {
          // e.preventDefault();
            cardFormBtnAdd.prop('disabled', true);
            cardFormBtnUpdate.prop('disabled', true);
          if(cardForm.find("input:radio[name=plan]:checked").val() != 'free'){


            stripe.card.createToken($scope.payment.card, function(status, response) {
              if (response.error) {
                formError.find('p').text(response.error.message);
                formError.removeClass('hidden');
                cardFormBtnUpdate.prop('disabled', false);
                cardFormBtnAdd.prop('disabled', false);
              } else {
                var token = response.id;
                var payment = $scope.payment;
                cardForm.append($('<input type="hidden" name="stripeToken" />').val(token));
                $scope.payment.token = response.id;
                return $http.post(config.apiRoot + '/v1/billing', { stripeToken: response.id, card: response.card })
                  .then(function (res) { 
                      // console.log(res);
                      $scope.payment.card = void 0;
                  })
                  .then(function (payment) {
                    swal({   title: "Success",   text: "Card added",   type: "success",   confirmButtonText: "Close",   timer: 2000 }); 
                    setTimeout(function() {
                      $state.go('app.profile');
                    }, 1000);                  
                    // console.log('successfully submitted payment');
                  })
                  .catch(function (err) {
                    if (err.type && /^Stripe/.test(err.type)) {
                      swal({   title: "Error",   text: "Stripe error",   type: "error",   confirmButtonText: "Close" });                                                                
                      // console.log('Stripe error: ', err.message);
                    }
                    else {
                      swal({   title: "Error",   text: "An internal error occured",   type: "error",   confirmButtonText: "Close" });                                          
                      // console.log('Other error occurred, possibly with your API', err.message);
                    }
                  });                            
                cardForm.get(0).submit();
              }

            });

            return false;
          }
        // });

      }(jQuery));
    };

    vm.getPlanInfo = function (plan) { 
      if(plan === "Team") {
        swal({   
          title: plan + " Subscription",   
          text: "The " + plan + " plan offers members all of the Pro plan capacities in addition to team functionality",   
          type: "info",   
          showCancelButton: false, 
          animation: false,  
          confirmButtonColor: "#55acee",   
          confirmButtonText: "Ok",   
          closeOnConfirm: false,   
          closeOnCancel: false,
          showLoaderOnConfirm: true        
        });
      } else if (plan === "Pro") {
        swal({   
          title: plan + " Subscription",   
          text: "The " + plan + " plan offers users extended abilities within TimeKloud including invoicing, billing, themes, and more",   
          type: "info",   
          showCancelButton: false,  
          animation: false, 
          confirmButtonColor: "#55acee",   
          confirmButtonText: "Ok",   
          closeOnConfirm: false,   
          closeOnCancel: false,
          showLoaderOnConfirm: true        
        });
      } else {
        swal({   
          title: plan + " Subscription",   
          text: "The " + plan + " plan offers basic TimeKloud functionality",   
          type: "info",   
          showCancelButton: false,  
          animation: false, 
          confirmButtonColor: "#55acee",   
          confirmButtonText: "Ok",   
          closeOnConfirm: false,   
          closeOnCancel: false,
          showLoaderOnConfirm: true        
        });        
      }
    }

    vm.updatePlan = function (plan) { 
      // console.log(plan);
      swal({   
        title: "Confirm",   
        text: "Your account will be updated to the " + plan + " plan", 
        animation: false,                   
        type: "info",   
        showCancelButton: true,   
        confirmButtonColor: "#25CC9A",   
        confirmButtonText: "Yes, update!",   
        cancelButtonText: "No, cancel",   
        closeOnConfirm: false,   
        closeOnCancel: false,
        showLoaderOnConfirm: true        
      }, 
        function(isConfirm){   
          if (isConfirm) {     
            var _plan = plan;
            $scope.plan = _plan;
            UserFactory.getProfile().then(function (res) {
              if(res.data.stripe.last4) {
                $http.post(config.apiRoot + '/v1/plan', {
                    user: $scope.user,
                    plan: _plan
                  })
                  .success(function(data) {
                    if(data.msg == "Same plan") {
                      swal({   title: "Info", animation: false,   text: "Already subscribed to this plan!",   type: "info",   confirmButtonText: "Close" });                                                                                  
                    }
                    swal({   title: "Success",   animation: false,  text: "Subscription added for " + data.msg.stripe.plan + " plan",   type: "success",   confirmButtonText: "Close" }); 
                    $state.go('app.profile');                             
                      // This is the value we will be "watching".
                      // When you watch a "vm.*" value from within the Controller, you are
                      // making the assumption (ie, creating coupling) that your View is using
                      // the same variable - "vm" - externally that you are using internally.
                      // --
                      // CAUTION: In our case, this is NOT true - the view is using the
                      // "appController" alias.
                  })
                  .error(function(err) {
                    swal({   title: "Error",   text: "An internal error occured",   type: "error",   confirmButtonText: "Close" });                                                    
                });        
              }
              else if(res.data.stripe.plan !== _plan && res.data.stripe.last4) {
                $http.post(config.apiRoot + '/v1/plan', {
                    user: $scope.user,
                    plan: _plan
                  })
                  .success(function(data) {
                    swal({   title: "Success",  animation: false,   text: "Subscription updated",   type: "success",   confirmButtonText: "Close" });                              
                    // notifications.showSuccess('Profile changes saved');
                  })
                  .error(function(err) {
                    swal({   title: "Error",   text: "An internal error occured",   type: "error",   confirmButtonText: "Close" });                                                    
                });        
              } 
              else if(!res.data.stripe.last4) {
                    swal({   title: "Error",  animation: false,   text: "No Credit Card Entered!",   type: "error",   confirmButtonText: "Close" });                                                              
              }
              else {
                    swal({   title: "Info",  animation: false,   text: "Already subscribed to this plan!",   type: "info",   confirmButtonText: "Close" });                                                            
              }
            }) 
          } else {     
                    swal({   title: "Cancelled",  animation: false,   text: "Plan not updated",   type: "info",   confirmButtonText: "Close" });                                                            
          } 
        });      
    };


    vm.closeAccount = function (user) {       
      var _user = user;
      swal({   
        title: "Delete Account",   
        imageUrl: "app/img/interdit.png",                        
        text: "Your account will be permanently deleted! Enter password to continue.",   
        type: "input",   
        animation: false,        
        confirmButtonColor: "#F27474",           
        showCancelButton: true,   
        confirmButtonText: "Yes, delete my account",   
        cancelButtonText: "No, cancel",   
        closeOnConfirm: false,   
        closeOnCancel: true,
        showLoaderOnConfirm: false        
      }, function(inputValue) {
        SweetAlertMultiInputReset(); // make sure you call this  
        //TODO: CHECK FOR PASSWORD MATCH        
        var arr = JSON.parse(inputValue);
        var password = arr[0];    
        if(password !== null && password !== undefined && password !== "") {
          $http.post(config.apiRoot + '/v1/removeaccount', {
            user: _user,
            email: _user.email,
            password: password
          })
          .success(function(data) {
              swal({   
                      title: "Account Deleted",   
                      text: "Your account has been deleted",   
                      type: "success",   
                      confirmButtonColor: "#2ECC71",           
                      showCancelButton: false,   
                      confirmButtonText: "Exit",   
                      closeOnConfirm: true,   
                      closeOnCancel: true,
                      showLoaderOnConfirm: true        
                    }, function() {
                        $state.go('login');
                    });
          })
          .error(function(err) {
            vm.responseErrorMsg = err.message;
          });          
        } else {
              swal({   
                title: "Error",   
                text: "Password cannot be empty",   
                type: "error",   
                showCancelButton: false,   
                confirmButtonText: "Ok",   
                closeOnConfirm: true,   
                closeOnCancel: true,
                showLoaderOnConfirm: true        
              });          
        }
      });
        //set up the fields: labels
      var tooltipsArray = [""];
      //set up the fields: defaults
      var defaultsArray = [""];
      //we use an extra field here, only takes "float" or "string"
      var typesArray = ["password"];
      SweetAlertMultiInput(tooltipsArray,defaultsArray,typesArray); 
    };

    vm.update = function(user, role) {
      var currentTheme = user.theme;
      // console.log(user.theme);
      var _user = user;
      var _role = role;
      var themeNum;
      // console.log(themeNum);
      $rootScope.themeSelected !== $rootScope.userTheme ? themeNum = $rootScope.themeSelected : themeNum = $rootScope.userTheme;
      // console.log(_user);
      $http.put(config.apiRoot + '/v1/profile', {
        user: _user,
        role: $scope.roles,
        apiKey: $rootScope.apiKey,
        theme: themeNum,
        picture: {
          id: $rootScope.profilePicId,
          secureUrl: $rootScope.profilePicSecureUrl
        }
      })
      .success(function(data) {
        notifications.showSuccess('Profile changes saved');
        $state.go('app.profile');
        if(currentTheme !== themeNum && themeNum !== undefined) {
          $state.go('app.editprofile');          
          notifications.showSuccess('Theme changed, please refresh browser for full changes to take effect.')
        }
      })
      .error(function(err) {
        vm.responseErrorMsg = err.message;
      });
    };

    vm.cancel = function() {
      vm.responseErrorMsg = '';
      // vm.user = {};
    };
  }

})();
