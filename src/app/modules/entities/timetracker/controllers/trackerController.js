(function () {

    var TrackerController = function ($scope, $state, $rootScope, $document, logsFactory, statusFactory, projectsFactory, UserFactory, $interval, $http, $window, notifications, config) {
        $scope.loaded = false;
        $scope.counter = null;
        $scope.status = null;
        $scope.projectsRaw = null;
        $scope.projectsConverted = null;
        $scope.tasksConverted = null;
        var _intervalId;

        function init(user) {
            $scope.counter = "00:00:00";
            $scope.projectsRaw = projectsFactory.getProjects(user);
            //potential memory issue
            $scope.projectsRaw.$watch(function () {
                $scope.projectsConverted = [];
                for (var i = 0, len = $scope.projectsRaw.length; i < len; i++) {
                    var _id = $scope.projectsRaw[i].$id;
                    var _name = $scope.projectsRaw[i].name;
                    $scope.projectsConverted.push({
                        id: _id,
                        name: _name
                    });
                };
            });
            
            $scope.tasksRaw = projectsFactory.getTasks(user);
            //potential memory issue            
            $scope.tasksRaw.$watch(function () {
                $scope.tasksConverted = [];
                for (var i = 0, len = $scope.tasksRaw.length; i < len; i++) {
                    var _id = $scope.tasksRaw[i].$id;
                    var _name = $scope.tasksRaw[i].name;
                    $scope.tasksConverted.push({
                        id: _id,
                        name: _name
                    });
                };
            });

            $scope.status = statusFactory.getStatus(user);
            //potential memory issue            
            $scope.status.$watch(function () {
                if ($scope.status.active) {
                    _intervalId = $interval(updateTime, 1000);
                } else {
                    stopTime();
                }
            });

            $scope.status.$loaded(function () {
                $scope.loaded = true;                    
            });
        }

        function updateTime() {
            var seconds = moment().diff(moment($scope.status.dateStart, 'x'), 'seconds');
            var elapsed = moment().startOf('day').seconds(seconds).format('HH:mm:ss');
            $scope.counter = elapsed;
            $scope.hours = parseInt(elapsed.substring(0,2));
            $scope.minutes = parseInt(elapsed.substring(3,5));
            $scope.seconds = parseInt(elapsed.substring(6,8));
            $scope.current = parseInt(elapsed.substring(6,8));
            $scope.hourlyrate = $scope.hours * $scope.status.billRate;          
            $scope.revenue = ($scope.hours * $scope.status.billRate+$scope.minutes * $scope.status.billRate/60+$scope.seconds * $scope.status.billRate/3600).toFixed(2);
        }
        
        function stopTime() {
            $interval.cancel(_intervalId);
            $scope.counter = "00:00:00";
            $scope.hours = 0;
            $scope.minutes = 0;
            $scope.seconds = 0;
            $scope.current = 0;
            $scope.hourlyrate = 0;        
            $scope.revenue = 0;   
            $rootScope.statusNotifications = false;                     
        }

        $scope.startTracker = function () {
            if (!!$scope.status.activeProjectId && !!$scope.status.activeTaskId) {
                $window.timer = true;
                $scope.status.active = true;
                $rootScope.statusNotifications = true;
                console.log($rootScope.statusNotifications);
                $scope.status.dateStart = moment().format('x');
                $scope.status.$save();
            }
        };

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

        $scope.state_counter = false;
        $scope.toggleState = function(state) {
                //only fired once, fix later
                $scope.state_counter=!state;
        }

        $scope.stopTracker = function () {
            stopTime();
            $window.timer = false;
            $scope.status.active = false;
            if (!!$scope.status.dateStart) {
                var seconds = moment().diff(moment($scope.status.dateStart, 'x'), 'seconds');
                if (seconds > 0) {
                    notifications.showSuccess('Task ID ' + $scope.status.activeTaskId + ' added to logs');                    
                    logsFactory.addLog($scope.status.activeProjectId, $scope.status.dateStart, seconds, $scope.status.notes, $scope.status.activeTaskId);
                    logsFactory.updateLog($scope.status.activeProjectId, $scope.status.dateStart, seconds, $scope.status.notes, $scope.status.activeTaskId);
                    $http.post(config.apiRoot + '/v1/timesheet', {
                        projectId: $scope.status.activeProjectId, 
                        dateStart: $scope.status.dateStart, 
                        secondsElapsed: seconds, 
                        projectNotes: $scope.status.notes,
                        projectBillRate: $scope.status.billRate,
                        orgId: $scope.user.orgId
                    }).
                      success(function(data, status, headers, config) {
                        // console.log(data);
                        // console.log(status);
                      }).
                      error(function(data, status, headers, config) {
                        // console.log(data);
                        // console.log(status);
                      });
                }
            }          
            $scope.status.$save();
        };

        UserFactory.getProfile().then(function (res) {
            init(res.data);            
        })
    };

    TrackerController.$inject = ['$scope', '$state', '$rootScope', '$document', 'logsFactory', 'statusFactory', 'projectsFactory', 'UserFactory', '$interval', '$http', '$window', 'notifications', 'appconfig'];

    angular.module('app.timetracker').controller('TrackerController', TrackerController);

}());