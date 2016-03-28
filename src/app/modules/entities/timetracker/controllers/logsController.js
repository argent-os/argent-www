(function () {

    var LogsController = function ($scope, logsFactory, projectsFactory, UserFactory, config) {
        $scope.loaded = false;
        $scope.projects = null;
        $scope.logs = null;
        $scope.logArr = [];
        $scope.timeArr = [];
        function init(user) {
            $scope.projects = projectsFactory.getProjects(user);
            $scope.logs = logsFactory.getLogs(user);

            $scope.logs.$loaded().then(function (x) {
                $scope.loaded = x === $scope.logs;
            })
        }
        
        $scope.getProjectName = function(log) {
            for (var x = 0, lenx = $scope.projects.length; x < lenx; x++) {
                if ($scope.projects[x].$id == log.projectId) {
                    return $scope.projects[x].name;
                }
            }
            return null;
        };
        
        $scope.getDateStart = function(log) {
            return moment(log.dateStart, "x").format("HH:mm:ss, DD-MM-YYYY");
        };
        
        $scope.getTime = function(log, user) {
            return moment().startOf('day').seconds(log.seconds).format('HH:mm:ss');           
        };

        UserFactory.getProfile().then(function (res) {
            init(res.data);            
        })
    };

    LogsController.$inject = ['$scope', 'logsFactory', 'projectsFactory', 'UserFactory', 'appconfig'];

    angular.module('app.timetracker').controller('LogsController', LogsController);

}());