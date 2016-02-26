(function() {
    'use strict';

    angular.module('app.common')
        .config(notificatorConfig)
        .factory('notificator', notificator)
        .run(notificationsRun)
        .directive('showTimerNotification', ['webNotification', '$window', '$rootScope', function (webNotification, $window, $rootScope) {
        return {
            restrict: 'C',
            template: '',
            link: function (scope, element) {
                if(JSON.parse(element.attr('show-notifications'))) { 
                    setInterval(function(){  
                        if($rootScope.statusNotifications == true) {
                            webNotification.showNotification('Time tracking', {
                                body: scope.counter.substring(0,2) + ' hours spent on task',
                                icon: '../app/img/ios_icons/target.png'
                            }, function onShow(error, hide) {
                                if (error) {
                                    window.alert('Unable to show notification: ' + error.message);
                                } else {
                                    // console.log('Notification Shown.');
                                    setTimeout(function hideNotification() {
                                        //console.log('Hiding notification....');
                                        hide();
                                    }, 120000);
                                }
                            });
                        }
                    }, 3600000);
                }
            }
        };
    }]);

    notificator.$inject = ['toastr'];
    function notificator(toastr) {
        return {
            success: function(msg, title) {
                toastr.success(msg, title);
            },
            warning: function(msg, title) {
                toastr.warning(msg, title);
            },
            error: function(msg, title) {
                toastr.error(msg, title);
            },
            info: function(msg, title) {
                toastr.info(msg, title);
            }
        }
    }
    
    notificationsRun.$inject = ['$rootScope', 'notificator', '$timeout'];
    function notificationsRun($rootScope, notificator, $timeout) {
        $rootScope.$on('$userLoggedIn', function() {
            $timeout(function(){
                if($rootScope.user.displayName) {
                    notificator.info('Welcome ' + $rootScope.user.displayName.substr(0,$rootScope.user.displayName.indexOf(' ')) + '!', {
                        timeOut: 2000,
                        positionClass: 'toast-bottom-left'                        
                    });     
                } else {
                    notificator.info('Welcome ' + $rootScope.user.username + '!', {
                        timeOut: 2000,
                        positionClass: 'toast-bottom-left'                                                
                    });  
                    notificator.success('Protip: You can control the time tracker with the spacebar!', {
                        timeOut: 20000,
                        positionClass: 'toast-bottom-left'                                          
                    });    
                    notificator.success('Click help on the bottom right side for information about TimeKloud usage', {
                        timeOut: 20000,
                        positionClass: 'toast-bottom-right'                                          
                    });                                                              
                }              
            },1000);
        });
        $rootScope.$on('$userLoggedOut', function() {
            notificator.success('Logged out successfully');
        });
    }
    notificatorConfig.$inject = ['toastrConfig'];
    function notificatorConfig(toastrConfig) {
        angular.extend(toastrConfig, {
            timeOut: 2000,
            iconClasses: {
              error: 'toast-error',
              info: 'toast-info',
              success: 'toast-success',
              warning: 'toast-warning'
            }                
        });
    }
})();
