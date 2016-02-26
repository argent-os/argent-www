(function () {

    var TeamTrackerController = function ($scope, $state, $rootScope, teamLogsFactory, teamStatusFactory, teamProjectsFactory, UserFactory, $interval, $http, notifications, config) {
        $scope.loaded = false;
        $scope.counter = null;
        $scope.status = null;
        $scope.projectsRaw = null;
        $scope.projectsConverted = null;
        $scope.tasksConverted = null;
        var _intervalId;

        function init(user) {
            $scope.counter = "00:00:00";

            $scope.projectsRaw = teamProjectsFactory.getProjects(user);
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

            $scope.tasksRaw = teamProjectsFactory.getTasks(user);
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
        }

        $scope.startTracker = function () {
            if (!!$scope.status.activeProjectId && !!$scope.status.activeTaskId) {
                $scope.status.active = true;
                $scope.status.dateStart = moment().format('x');
                $scope.status.$save();
            }
        };
        $scope.toggleNotifications = function(user) {
                // $state.go('app.editprofile');
                user.notificationsEnabled = !user.notificationsEnabled;
                $http.put(config.apiRoot + '/v1/profile/', {
                    user: user,
                    notificationsEnabled: user.notificationsEnabled
                }).
                  success(function(data, status, headers, config) {
                  }).
                  error(function(data, status, headers, config) {
                  });                            
            
        }

        $scope.state_counter = false;
        $scope.toggleState = function(state) {
                $scope.state_counter=!state;
        }

        $scope.stopTracker = function () {
            stopTime();
            $scope.status.active = false;
            if (!!$scope.status.dateStart) {
                var seconds = moment().diff(moment($scope.status.dateStart, 'x'), 'seconds');
                if (seconds > 0) {
                    notifications.showSuccess('Task ' + $scope.status.notes + ' added to logs');                    
                    teamLogsFactory.addLog($scope.status.activeProjectId, $scope.status.dateStart, seconds, $scope.status.notes, $scope.status.activeTaskId);
                    teamLogsFactory.updateLog($scope.status.activeProjectId, $scope.status.dateStart, seconds, $scope.status.notes, $scope.status.activeTaskId);
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

    TeamTrackerController.$inject = ['$scope', '$state', '$rootScope', 'teamLogsFactory', 'teamStatusFactory', 'teamProjectsFactory', 'UserFactory', '$interval', '$http', 'notifications', 'appconfig'];

    angular.module('app.team').controller('TeamTrackerController', TeamTrackerController);

}());