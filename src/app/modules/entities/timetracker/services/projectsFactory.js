(function () {
    var projectsFactory = function ($firebaseArray, $firebaseObject, config, UserFactory, $rootScope) {
        var factory = [];

        factory.getProjects = function (user) {
            var ref = new Firebase('/users/' + user.username + '/projects/');
            var list = $firebaseArray(ref);
            return list;
        };
    
        factory.getTasks = function (user) {
            var ref = new Firebase('/users/' + user.username + '/tasks');      
            var list = $firebaseArray(ref);
            return list;
        };

        factory.getTaskById = function (user, id) {
            var ref = new Firebase('/users/' + user.username + '/tasks/' + id);
            ref.once('value', function(snap) {
                var obj = snap.val();
                return obj;
            })
        };

        factory.checkIfTaskExists = function (user, task) {
            var ref = new Firebase('/users/' + user.username + '/tasks');
            var list = $firebaseArray(ref);
            return list;
        };

        factory.getProjectById = function(user, id) {
            var ref = new Firebase('/users/' + user.username + '/projects/' + id);
            var obj = $firebaseObject(ref);
            return obj;
        };

        return factory;
    };

    projectsFactory.$inject = ['$firebaseArray', '$firebaseObject', 'appconfig', 'UserFactory', '$rootScope'];

    angular.module('app.timetracker').factory('projectsFactory', projectsFactory);

}());