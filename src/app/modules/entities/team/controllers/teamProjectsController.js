(function () {

    var TeamProjectsController = function (config, notifications, $scope, teamProjectsFactory, teamLogsFactory, UserFactory, OrganizationFactory) {
        $scope.loaded = false;
        $scope.projects = null;
        $scope.logs = null;

        $scope.hexPicker = {
          color: '#55acee'
        };

        $scope.$watch('hexPicker.color',
        function(newValue,oldValue){
            $scope.hexPicker.color = newValue;
        });        

        $scope.hexBorder = '3px solid ' + $scope.hexPicker.color;  

        function init(user, organization) {
            $scope.projects = teamProjectsFactory.getProjects(user);                
            $scope.teams = teamProjectsFactory.getTeams(organization); 
            $scope.tasks = teamProjectsFactory.getTasks(user);                
            $scope.logs = teamLogsFactory.getLogs(user);

            $scope.logs.$loaded().then(function (x) {
                $scope.loaded = x === $scope.logs;
            });
            $scope.teams.$loaded().then(function (x) {
                $scope.loaded = x === $scope.teams;
                // $scope.members = teamProjectsFactory.getMembers(organization, $scope.teams); 
                // for(var i=0;i<$scope.members.length;i++) {
                //     $scope.members[i].$loaded().then(function (y) {
                //         $scope.loadedmembers = y === $scope.members;
                //     }); 
                // }  
            });         
            $scope.tasks.$loaded().then(function (x) {
                $scope.loaded = x === $scope.tasks;
            });            
            $scope.projects.$loaded().then(function (x) {
                $scope.loaded = x === $scope.projects;
            });                        
        }

        $scope.addTeam = function(team) {
            swal({   title: "Add Team",   text: "",   
                type: "input",   
                imageUrl: "app/img/team.png",                
                showCancelButton: true,  
                closeOnCancel: true, 
                closeOnConfirm: false,  
                animation: false,  
                showLoaderOnConfirm: false, 
                inputPlaceholder: "Team name",
                confirmButtonText: "Create" 
              }, function(inputValue){
                    SweetAlertMultiInputReset(); // make sure you call this        
                    var arr = JSON.parse(inputValue);
                    var teamName = arr[0];
                    arr[1] !== "" ? teamColor = arr[1] : teamColor = "";
                    var teamPicture= arr[2];
                    if(teamName == "" || teamName == null || teamName == undefined) {
                        swal({   title: "Error", animation: false,   text: "Team name cannot be empty",   type: "error",   confirmButtonText: "Close" });
                        return;                       
                    }
                    UserFactory.getProfile().then(function (res) {
                        var user = res;
                        OrganizationFactory.getOrganization(user).then(function (res) {
                            var organization = res;
                            var teamRef = new Firebase('/organizations/' + organization.name + '/teams/' + teamName);
                            var teamList = new Firebase('/organizations/' + organization.name + '/teams');
                            teamList.once('value', function(snap) {
                                snap.forEach(function(childSnapshot) {
                                    var childData = childSnapshot.val();    
                                    if(teamName === childData.name || childData.name === 'false' || childData.name == "") {
                                        swal({   title: "Error", animation: false,  text: "Team already exists!",   type: "error",   confirmButtonText: "Close" });
                                        teamList.child(childSnapshot.key()).remove();
                                        return;
                                    } 
                                });                                   
                                teamColor == "" ? teamColor = '#' + Math.floor(Math.random() * 16777215).toString(16) : '';                              
                                $scope.teams.$add({
                                    name: teamName,
                                    color: teamColor,
                                    picture: teamPicture
                                });
                                //$scope.teamName = "";
                            })                                 
                        })               
                    });                 
              })
            //set up the fields: labels
            var tooltipsArray = ["Team Name","Team Color","Team Image (200x200px)"];
            //set up the fields: defaults
            var defaultsArray = ["",$scope.hexPicker.color,""];
            //we use an extra field here, only takes "float" or "string"
            var typesArray = ["team","color","image"];
            SweetAlertMultiInput(tooltipsArray,defaultsArray,typesArray);                          
        }

        $scope.addTeamMember = function(teamName) {
            var _teamName = teamName;
            swal({   title: "Add Team Member",   text: "Team " + _teamName + " | Enter member email below",   
                type: "input",   
                imageUrl: "app/img/member.png",                
                showCancelButton: true,  
                closeOnCancel: true, 
                closeOnConfirm: false,  
                animation: "slide-from-top",  
                showLoaderOnConfirm: false, 
                inputPlaceholder: "Member name",
                confirmButtonText: "Create" 
              }, function(inputValue){ 
                    var memberName = inputValue;
                    if(memberName == "" || memberName == null || memberName == undefined) {
                        swal({   title: "Error", animation: false,   text: "Member name cannot be empty",   type: "error",   confirmButtonText: "Close" });
                        return;                       
                    }
                    UserFactory.getProfile().then(function (res) {
                        var user = res;
                        OrganizationFactory.getOrganization(user).then(function (res) {
                            var organization = res;
                            // $scope.teamMemberRef = new Firebase('/' + organization.name + '/teams/' + teamName + '/members/' + memberName);
                            $scope.members = teamProjectsFactory.getTeamMembers(organization, _teamName);
                            $scope.members.$loaded().then(function (x) {
                                $scope.loaded = x === $scope.members;
                                $scope.members.$add({
                                    name: memberName
                                });                                    
                            })
                            // var teamList = new Firebase('/' + organization.name + '/teams');
                            // teamList.once('value', function(snap) {
                            //     // snap.forEach(function(childSnapshot) {
                            //     //     var childData = childSnapshot.val();    
                            //     //     if(teamName === childData.name || childData.name === 'false' || childData.name == "") {
                            //     //         swal({   title: "Error",   text: "Member already exists!",   type: "error",   confirmButtonText: "Close" });
                            //     //         teamList.child(childSnapshot.key()).remove();
                            //     //         return;
                            //     //     } 
                            //     // });                                   
                            //     //memberColor == "" ? memberColor = '#' + Math.floor(Math.random() * 16777215).toString(16) : '';                              

                            //     //$scope.teamName = "";
                            // })   
                                                      
                        })               
                    });                     
              })            
        }

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
                            swal({   title: "Error", animation: false,  text: "Project already exists!",   type: "error",   confirmButtonText: "Close" });
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
                            swal({   title: "Error", animation: false,   text: "Task already exists!",   type: "error",   confirmButtonText: "Close" });
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

        UserFactory.getProfile().then(function (res) {
            var user = res;
            OrganizationFactory.getOrganization(user).then(function (res) {
                var org = res;
                init(user, org);            
            })
        })
    };

    TeamProjectsController.$inject = ['appconfig', 'notifications', '$scope', 'teamProjectsFactory', 'teamLogsFactory', 'UserFactory', 'OrganizationFactory'];

    angular.module('app.team').controller('TeamProjectsController', TeamProjectsController);

}());