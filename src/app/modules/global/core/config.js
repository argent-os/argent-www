(function() {
  'use strict';

  var core = angular.module('app.core');

  var coreConfig = {
    name: 'Argent',
    appTitle: 'argent-app',
    version: '0.1.1'
  };

  core.value('coreConfig', coreConfig);
})();
