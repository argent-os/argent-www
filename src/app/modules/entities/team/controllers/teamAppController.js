(function () {

    var TeamTrackerController = function ($scope, $location, config) {
        $scope.config = config;
        $scope.navIsActive = function (path) {
            return path === $location.path();
        };
    };

    TeamTrackerController.$inject = ['$scope', '$location', 'appconfig'];

    angular.module('app.team').controller('TeamTrackerController', TeamTrackerController);

}());