(function() {
  'use strict';

  angular.module('app.project.modal', [])

  // Main application controller
  .controller('ProjectModalInstanceCtrl', ['$scope', '$http', 'UserFactory', 'projectsFactory', '$modalInstance', 'notifications', 'appconfig',
    function ($scope, $http, UserFactory, projectsFactory, $modalInstance, notifications, config) {

      var vm = this;
      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');            
      };

      UserFactory.getProfile().then(function (res) {
        init(res.data);        
      })
      function init(user) {
          $scope.projects = projectsFactory.getProjects(user);                                     
      }

      $scope.addProject = function (name) {
          var _name = name;
          UserFactory.getProfile().then(function (res) {
              var user = res.data;
              var projectRef = new Firebase(config.firebaseUrl + '/' + user.username + '/projects/');
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
  }])
})();
