(function () {

    var TeamLogsController = function ($scope, teamLogsFactory, teamProjectsFactory, UserFactory, config) {
        $scope.loaded = false;
        $scope.projects = null;
        $scope.logs = null;
        $scope.logArr = [];
        $scope.timeArr = [];
        function init(user) {
            $scope.projects = teamProjectsFactory.getProjects(user);
            $scope.logs = teamLogsFactory.getLogs(user);

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

    TeamLogsController.$inject = ['$scope', 'teamLogsFactory', 'teamProjectsFactory', 'UserFactory', 'appconfig'];

    angular.module('app.team').controller('TeamLogsController', TeamLogsController);

}());