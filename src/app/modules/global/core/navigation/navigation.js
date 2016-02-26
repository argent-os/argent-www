(function() {
  'use strict';

    navCollapseToggler.$inject = ['$document'];

  angular.module('app.core')
    .directive('navCollapseToggler', navCollapseToggler);

  $(document).ready(function() { 
    $("body").click(function(event) {
          // only do this if navigation is visible, otherwise you see jump in navigation while collapse() is called 
           if ($(".navbar-collapse").is(":visible") && $(".navbar-toggle").is(":visible")) {
              $('.navbar-collapse').collapse('toggle');
          }
    });
  });

  function navCollapseToggler($document) {

    return {
      restrict: 'A',
      scope: {
        type: '@'
      }

    }
  }
})();
