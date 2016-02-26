(function() {
  'use strict';

  angular.module('app.dashboard')
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['$scope', '$rootScope', '$sce', '$document'];
  function dashboardController($scope, $rootScope, $sce, $document) { 

    $scope.someData = {
        labels: [
        'Apr', 'May', 'Jun'
      ],
      datasets: [
        {
          data: [1, 7, 15, 19, 31, 40]
        },
        {
          data: [6, 12, 18, 24, 30, 36]
        }
      ]
    };

    $scope.lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            data: [65, 59, 90, 81, 56, 55, 40]
        }, {
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            data: [28, 48, 40, 19, 96, 27, 100]
        }]
    };

    $scope.alerts = [
      { type: 'warning', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Warning:</span> Best check yo self, you\'re not looking too good.') },
      { type: 'success', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Success:</span> You successfully read this important alert message.') },
      { type: 'info', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Info:</span> This alert needs your attention, but it\'s not super important.') },
      { type: 'danger', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Danger:</span> Change this and that and try again.'
      + '<a class="btn btn-default btn-xs pull-right mr" href="#">Ignore</a>'
      + '<a class="btn btn-danger btn-xs pull-right mr-xs" href="#">Take this action</a>') }
    ];

    $scope.addAlert = function() {
      $scope.alerts.push({type: 'warning', msg: $sce.trustAsHtml('Another alert!')});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }

})();
