(function() {
    var teamStatusFactory = function ($firebaseArray, $firebaseObject, config) {
        var factory = [];

        factory.getStatus = function (user) {
            var ref = new Firebase('/' + user.username + '/status/');
            var statusObject = $firebaseObject(ref);
            return statusObject;
        };
        
        factory.setStatus = function (params, user) {
            var ref = new Firebase('/' + user.username + '/status/');
            var sync = $firebaseObject(ref);
            sync.$set(params);
        };

        return factory;
    };


    teamStatusFactory.$inject = ['$firebaseArray', '$firebaseObject', 'appconfig'];

    angular.module('app.team').factory('teamStatusFactory', teamStatusFactory);

}());