(function () {

    var TimeTrackerController = function ($scope, $location, config) {
        $scope.config = config;
        $scope.navIsActive = function (path) {
            return path === $location.path();
        };
    };

    TimeTrackerController.$inject = ['$scope', '$location', 'appconfig'];

    angular.module('app.timetracker').controller('TimeTrackerController', TimeTrackerController);

}());