(function () {

    var NotificationsController = function ($scope, $state, $rootScope, $document, UserFactory, $interval, $http, $window, notifications, config) {
        
        function init(user) {

        }

        $scope.toggleNotifications = function(user) {
                user.notificationsEnabled = !user.notificationsEnabled;
                notifications.showSuccess('Please save your changes in edit profile');
                // $state.go('app.editprofile');                
                $http.put(config.apiRoot + '/v1/profile/', {
                    user: user,
                    notificationsEnabled: user.notificationsEnabled
                }).
                  success(function(data, status, headers, config) {
                        if(data.user.notificationsEnabled == true) {
                              (function notify() {
                                // Let's check if the browser supports notifications
                                if (!("Notification" in window)) {
                                  alert("This browser does not support desktop notification");
                                }
                                // Let's check whether notification permissions have already been granted
                                else if (Notification.permission === "granted") {
                                  // If it's okay let's create a notification
                                  (function spawnNotification(theBody,theIcon,theTitle) {
                                    var options = {
                                        body: 'Please save your changes!  TimeKloud desktop notifications are now enabled, alerts will occur on a regularly scheduled interval by the hour if timetracker is active',
                                        icon: 'app/img/notification-icon.png'
                                    }
                                    var n = new Notification('Notification',options);
                                  })()  
                                }
                                // Otherwise, we need to ask the user for permission
                                else if (Notification.permission !== 'denied') {
                                  Notification.requestPermission(function (permission) {
                                    // If the user accepts, let's create a notification
                                    if (permission === "granted") {
                                      var notification = new Notification("Desktop notifications enabled");
                                    }
                                  });
                                }
                                // At last, if the user has denied notifications, do not attempt to re-request notifications
                              })();                    
                        }                    
                  }).
                  error(function(data, status, headers, config) {
                  });                            
            
        }

        UserFactory.getProfile().then(function (res) {
            init(res.data);            
        })
    };

    TrackerController.$inject = ['$scope', '$state', '$rootScope', '$document', 'UserFactory', '$interval', '$http', '$window', 'notifications', 'appconfig'];

    angular.module('app.timetracker').controller('TrackerController', TrackerController);

}());