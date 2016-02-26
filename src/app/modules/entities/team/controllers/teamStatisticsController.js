(function () {

    var TeamStatisticsController = function ($scope, $stateParams, teamLogsFactory, teamProjectsFactory, UserFactory) {
        $scope.loaded = false;
        $scope.days = null;
        $scope.logs = null;
        $scope.projects = null;

        $scope.labels = null; // array of dates (x axis)
        $scope.series = null; // array of projects
        $scope.data = null; // multi array - data per project

        $scope.chartLastRendered = null;

        var projectId = $stateParams.projectId;

        function init(user) {
            $scope.days = 7;
            $scope.projects = teamProjectsFactory.getProjects(user);
            $scope.projects.$loaded().then(function () {
                $scope.logs = teamLogsFactory.getLogs(user);
                $scope.logs.$loaded().then(function (x) {
                    $scope.loaded = x === $scope.logs;
                    renderChart();
                    $scope.logs.$watch(function () {
                        renderChart();
                    });
                });
            });
        }
        
        function renderChart() {
            if ($scope.logs.length > 0 && $scope.projects.length > 0) {
                if ($scope.chartLastRendered == null || moment().diff($scope.chartLastRendered) >= 100) {

                    console.log('rendering chart with days: ' + $scope.days);

                    // add the dates
                    $scope.labels = [];
                    for (var i = 0, len = $scope.days; i < len; i++) {
                        var date = moment().subtract(i, 'days').format('DD/MM');
                        $scope.labels.push(date);
                    }
                    $scope.labels.reverse();

                    // add the projets
                    $scope.series = [];
                    for (var i = 0, len = $scope.projects.length; i < len; i++) {
                        if ((!!projectId && projectId == $scope.projects[i].$id) || !projectId) {
                            var name = $scope.projects[i].name;
                            $scope.series.push(name);
                        }
                    }

                    // add the data
                    $scope.data = {labels:[],datasets:[]};
                    for (var y = 0, leny = $scope.projects.length; y < leny; y++) {
                        if ((!!projectId && projectId == $scope.projects[y].$id) || !projectId) {
                            var _project = $scope.projects[y];
                            var _data = [];

                            for (var i = 0, leni = $scope.days; i < leni; i++) {
                                var _date = moment().subtract(i, 'days').format('MM-DD-YYYY');
                                var _seconds = 0;

                                for (var x = 0, lenx = $scope.logs.length; x < lenx; x++) {
                                    var _log = $scope.logs[x];
                                    var _logDate = moment(_log.dateStart, 'x').format('MM-DD-YYYY');

                                    if (_log.projectId == _project.$id && _logDate == _date) {
                                        _seconds += _log.seconds;
                                    }
                                }

                                _data.push(_seconds);
                            }

                            _data.reverse();
                            $scope.data.labels.push({ labels: [y] });
                            $scope.data.datasets.push({ data: _data })
                        }
                    }

                    $scope.chartLastRendered = moment();                    
                    return $scope.data;

                }
            }
        }

        $scope.setDays = function (days) {
            $scope.days = days;
            renderChart();
        };

        UserFactory.getProfile().then(function (res) {
            init(res.data);            
        })
    };

    TeamStatisticsController.$inject = ['$scope', '$stateParams', 'teamLogsFactory', 'teamProjectsFactory', 'UserFactory'];

    angular.module('app.team').controller('TeamStatisticsController', TeamStatisticsController);

}());