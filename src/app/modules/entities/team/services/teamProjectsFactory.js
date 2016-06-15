(function () {
    var teamProjectsFactory = function ($firebaseArray, $firebaseObject, config, UserFactory) {
        var factory = [];

        factory.getProjects = function (user) {
            var ref = new Firebase('/' + user.username + '/projects/');
            var list = $firebaseArray(ref);
            return list;
        };
    
        factory.getTasks = function (user) {
            var ref = new Firebase('/' + user.username + '/tasks');
            var list = $firebaseArray(ref);
            return list;
        };

        factory.getTeams = function (organization) {
            var ref = new Firebase('/organizations/' + organization.name + '/teams');
            var list = $firebaseArray(ref);
            return list;
        };

        factory.getAllMembers = function (organization, teams) {
            var memberList = [];
            for(var i=0;i<teams.length;i++) {
                var ref = new Firebase('/organizations/' + organization.name + '/teams/' + teams[i].name);  
                memberList.push($firebaseArray(ref));                              
            }
            return memberList;
        };

        factory.getTeamMembers = function (organization, teamName) {
            var ref = new Firebase('/organizations/' + organization.name + '/teams/' + teamName + '/members');  
            var memberList = $firebaseArray(ref);                              
            return memberList;
        };

        factory.getTaskById = function (user, id) {
            var ref = new Firebase('/' + user.username + '/tasks/' + id);
            ref.once('value', function(snap) {
                var obj = snap.val();
                return obj;
            })
        };

        factory.checkIfTaskExists = function (user, task) {
            var ref = new Firebase('/' + user.username + '/tasks');
            var list = $firebaseArray(ref);
            return list;
        };

        factory.getProjectById = function(user, id) {
            var ref = new Firebase('/' + user.username + '/projects/' + id);
            var obj = $firebaseObject(ref);
            return obj;
        };

        return factory;
    };

    teamProjectsFactory.$inject = ['$firebaseArray', '$firebaseObject', 'appconfig', 'UserFactory'];

    angular.module('app.team').factory('teamProjectsFactory', teamProjectsFactory);

}());