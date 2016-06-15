(function() {
    var statusFactory = function ($firebaseArray, $firebaseObject, config) {
        var factory = [];

        factory.getStatus = function (user) {
            var ref = new Firebase('/users/' + user.username + '/status/');
            var statusObject = $firebaseObject(ref);
            return statusObject;
        };
        
        factory.setStatus = function (params, user) {
            var ref = new Firebase('/users/' + user.username + '/status/');
            var sync = $firebaseObject(ref);
            sync.$set(params);
        };

        return factory;
    };


    statusFactory.$inject = ['$firebaseArray', '$firebaseObject', 'appconfig'];

    angular.module('app.timetracker').factory('statusFactory', statusFactory);

}());