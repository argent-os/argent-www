(function () {
    var teamLogsFactory = function ($firebaseArray, $firebaseObject, config, UserFactory, teamProjectsFactory) {

        var factory = [];

        factory.getLogs = function (user) {
            var ref = new Firebase(config.firebaseUrl + '/' + user.username + '/logs');
            var logsArray = $firebaseArray(ref);
            return logsArray;
        };

        factory.getLogById = function (id, user) {
            var ref = new Firebase(config.firebaseUrl + '/' + user.username + '/logs/' + id);
            var logsArray = $firebaseObject(ref);
            return logsArray;
        };

        factory.updateLog = function(projectId, dateStart, seconds, notes, taskId) {
            var _taskId = taskId;
            UserFactory.getProfile().then(function(res) {
                var user = res.data;
                var taskRef = new Firebase(config.firebaseUrl + '/' + res.data.username + '/tasks/' + _taskId);
                taskRef.once('value', function(snap) {
                    // console.log(res);
                    var ref = new Firebase(config.firebaseUrl + '/' + res.data.username + '/logs/');
                    var sync = $firebaseArray(ref);
                    sync.$add({
                        projectId: projectId,
                        dateStart: dateStart,
                        seconds: seconds,
                        notes: null,
                        task: snap.val().name         
                    }).then(function (ref) {
                        console.log(ref.key());
                    }, function (error) {
                        console.log('Error:', error);
                    });      
                })              
            });
        };

        factory.addLog = function (projectId, dateStart, seconds, notes, taskId) {
            var _task = taskId;
            UserFactory.getProfile().then(function(res) {
                var user = res.data;
                var taskRef = new Firebase(config.firebaseUrl + '/' + res.data.username + '/tasks/' + _taskId);
                taskRef.once('value', function(snap) {
                    // console.log(res);
                    var ref = new Firebase(config.firebaseUrl + '/' + res.data.username + '/logs/');
                    var sync = $firebaseArray(ref);
                    sync.$add({
                        projectId: projectId,
                        dateStart: dateStart,
                        seconds: seconds,
                        notes: null,
                        task: snap.val().name         
                    }).then(function (ref) {
                        console.log(ref.key());
                    }, function (error) {
                        console.log('Error:', error);
                    });      
                })                   
            });
        };

        return factory;
    };


    teamLogsFactory.$inject = ['$firebaseArray', '$firebaseObject', 'appconfig', 'UserFactory', 'teamProjectsFactory'];

    angular.module('app.team').factory('teamLogsFactory', teamLogsFactory);

}());