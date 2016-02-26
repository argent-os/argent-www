(function () {

    var StatisticsController = function ($scope, $stateParams, logsFactory, projectsFactory, UserFactory) {
        $scope.loaded = false;
        $scope.days = null;
        $scope.logs = null;
        $scope.projects = null;

        $scope.labels = null; // array of dates (x axis)
        $scope.series = null; // array of projects
        $scope.data = null; // multi array - data per project

        $scope.chartLastRendered = null;

        var projectId = $stateParams.projectId;

    $scope.lineChartData = {
      labels: [
        'Jan', 
        'Feb', 
        'Mar'
      ],
      datasets: [
        {
          data: [0, 5, 10, 15, 20, 25]
        },
        {
          data: [3, 6, 9, 12, 15, 18]
        }
      ]
    };
    
        $scope.someOptions = {
        segementStrokeWidth: 20,
        segmentStrokeColor: '#55acee',
scaleFontColor: "#d9d9d9",
    scaleGridLineColor : "rgba(255,255,255,0.1)",

    };

    $scope.lineChartData2 = {
      labels: [
        'Apr', 
        'May', 
        'Jun'
      ],
      datasets: [
        {
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",            
          data: [1, 7, 15, 19, 31, 40]
        },
        {
          data: [6, 12, 18, 24, 30, 36]
        }
      ]
    };
    
    $scope.activeData = $scope.lineChartData;

    $scope.swapData = function () {
      $scope.activeData = $scope.lineChartData2;
    };
        function init(user) {
            $scope.days = 7;
            $scope.projects = projectsFactory.getProjects(user);
            $scope.projects.$loaded().then(function () {
                $scope.logs = logsFactory.getLogs(user);
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

                    // console.log('rendering chart with days: ' + $scope.days);

                    // add the dates
                    $scope.labels = [];
                    $scope.colors = [];
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
$scope.colors = ['#FD1F5E','#1EF9A1','#7FFD1F','#68F000'];
                            _data.reverse();
                            $scope.labels.scaleFontColor = "blue";
                            $scope.data.labels = $scope.labels;
                            $scope.data.datasets.push({ data: _data, 
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
                    labelFontColor: "#55acee",

            pointStrokeColor: "#55acee",  
                scaleLineColor: "rgba(0,0,0,.1)",
dataLabelColor: "#55acee",
    scaleGridLineColor : "orange",
    angleLineColor : "cyan",
    pointLabelFontColor : "blue",

    scaleBackdropColor : "magenta",
    segmentStrokeColor : "pink",
    scaleShowHorizontalLines: true,
    scaleGridLineColor : "#eee",

    scaleShowVerticalLines: true,
                             })
                        }
                    }
    //                 var myLine = new Chart(document.getElementById("cpu-chart").getContext("2d"))
    // .Line(lineChartData, { scaleFontColor: "#ff0000" });

                    $scope.chartLastRendered = Date.now();     
                    // console.log($scope.labels);               
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

    StatisticsController.$inject = ['$scope', '$stateParams', 'logsFactory', 'projectsFactory', 'UserFactory'];

    angular.module('app.timetracker').controller('StatisticsController', StatisticsController);

}());