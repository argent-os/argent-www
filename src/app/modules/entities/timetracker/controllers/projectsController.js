(function () {

    var ProjectsController = function (config, $modal, $scope, $rootScope, projectsFactory, logsFactory, UserFactory) {
        $scope.loaded = false;
        $scope.projects = null;
        $scope.logs = null;
        $scope.tasksArr=[];
        $scope.projectsList=[];

        $scope.subline = "For example: <em>Los Angeles</em> or <em>New York</em>";
        //init bootstrap loader button
        (function() {
          Ladda.bind( '.ladda-button' );
          Ladda.bind( 'input[type=submit]' );  
          Ladda.bind( 'button[type=submit]' );  
          Ladda.bind( 'div:not(.progress-demo) button', { timeout: 2000 } );
          Ladda.bind( '.progress-demo button', {
            callback: function( instance ) {
              var progress = 0;
              var interval = setInterval( function() {
                progress = Math.min( progress + Math.random() * 0.1, 1 );
                instance.setProgress( progress );
                if( progress === 1 ) {
                  instance.stop();
                  clearInterval( interval );
                }
              }, 200 );
            }
          });
        })();
        function init(user) {
            $scope.projects = projectsFactory.getProjects(user);                
            $scope.tasks = projectsFactory.getTasks(user);                
            $scope.logs = logsFactory.getLogs(user);
            
            $scope.logs.$loaded().then(function (x) {
                $scope.loaded = x === $scope.logs;
            });
            $scope.tasks.$loaded().then(function (x) {
                $scope.loaded = x === $scope.tasks;
                for(var i = 0; i<$scope.tasks.length; i++) {
                    $scope.tasksArr.push({"$id":$scope.tasks[i].$id,"name":$scope.tasks[i].name});
                }                
            });
            $scope.projects.$loaded().then(function (x) {
                $scope.loaded = x === $scope.projects;
                for(var i = 0; i<$scope.projects.length; i++) {
                    $scope.projectsList.push({"$id":$scope.projects[i].$id,"name":$scope.projects[i].name});
                }                   
            });                        
        }

        //template urls are found within project.html
        //be sure to make sure you are in project.html for template url id
        $scope.openCreateProjectModal = function (size) {
          var modalInstance = $modal.open({
            templateUrl: 'createProject.html',
            animation: false,
            controller: 'ProjectModalInstanceCtrl',
            windowClass: 'animated bounceIn',
            backdropClass: 'modal-backdrop',
            size: size
          });
          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            // $log.info('Modal dismissed at: ' + new Date());
          });
        };

        $scope.openCreateTaskModal = function (size) {
          var modalInstance = $modal.open({
            templateUrl: 'createTask.html',
            animation: false,
            controller: 'ProjectModalInstanceCtrl',
            windowClass: 'animated bounceIn',
            backdropClass: 'modal-backdrop',
            size: size
          });
          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            // $log.info('Modal dismissed at: ' + new Date());
          });
        };

        $scope.getTimeSpent = function (project) {
            var seconds = 0;
            // console.log(project);
            for (var i = 0, len = $scope.logs.length; i < len; i++) {
                if ($scope.logs[i].projectId == project.$id) {
                    seconds += $scope.logs[i].seconds;
                }
            }
            var timeSpent = moment().startOf('day').seconds(seconds).format('HH:mm:ss');
            return timeSpent;
        };

        $scope.addProject = function (name) {
            var _name = name;
            UserFactory.getProfile().then(function (res) {
                var user = res.data;
                var projectRef = new Firebase('/' + user.username + '/projects/');
                projectRef.once('value', function(snap) {
                    snap.forEach(function(childSnapshot) {
                        var childData = childSnapshot.val();    
                        if(_name === childData.name) {
                            swal({   title: "Error",   text: "Project already exists!",   type: "error",   confirmButtonText: "Close" });
                            projectRef.child(childSnapshot.key()).remove();
                        } 
                    });   
                    $scope.projects.$add({
                        name: name
                    });
                    $scope.projectName = "";
                    $scope.project_form.$setPristine();                                                             
                })                    
            });                            
        };

        $scope.addTask = function (task) {
            var _task = task;
            UserFactory.getProfile().then(function (res) {
                var user = res.data;
                var taskRef = new Firebase('/' + user.username + '/tasks/');
                taskRef.once('value', function(snap) {
                    snap.forEach(function(childSnapshot) {
                        var childData = childSnapshot.val();    
                        if(_task === childData.name) {
                            swal({   title: "Error",   text: "Task already exists!",   type: "error",   confirmButtonText: "Close" });
                            taskRef.child(childSnapshot.key()).remove();
                        } 
                    });   
                    $scope.tasks.$add({
                        name: _task
                    });
                    $scope.taskName = "";
                    $scope.task_form.$setPristine();                                                              
                })                    
            });              
        };

        $scope.deleteProject = function (project) {
            var _id = project.$id;
            if ($scope.logs.length > 0) {
                for (var i = 0, len = $scope.logs.length; i < len; i++) {
                    if ($scope.logs[i].projectId == _id) {
                        $scope.logs.$remove($scope.logs[i]);
                    }
                }
            }
            $scope.projects.$remove(project);
        };

        $scope.deleteTask = function (task) {
            var _id = task.$id;
            if ($scope.logs.length > 0) {
                for (var i = 0, len = $scope.logs.length; i < len; i++) {
                    if ($scope.logs[i].taskId == _id) {
                        $scope.logs.$remove($scope.logs[i]);
                    }
                }
            }
            $scope.tasks.$remove(task);
        };

        UserFactory.getProfile().then(function (res) {
            init(res.data);            
        })
    };

    ProjectsController.$inject = ['appconfig', '$modal', '$scope', '$rootScope', 'projectsFactory', 'logsFactory', 'UserFactory'];

    angular.module('app.timetracker').controller('ProjectsController', ProjectsController);

}());