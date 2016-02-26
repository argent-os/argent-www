(function() {
  'use strict';

  var module = angular.module('app.organization');

  module.service('deleteOrganizationModal', deleteOrganizationModal);

  deleteOrganizationModal.$inject = ['organizationResource', '$window', '$state', 'OrganizationFactory', 'commonModal', 'notificator'];
  function deleteOrganizationModal(organizationResource, $window, $state, OrganizationFactory, commonModal, notificator) {
    var that = this;
    this.modalOptions = {
      closeButtonText: 'Cancel',
      actionButtonText: 'Delete',
      headerText: 'Confirm organization deletion',
      bodyText: 'The organization and all data associated with it including users and companies will be deleted permanently, do you want to continue?'
    };
    this.modalDefaults = {
      windowClass: 'small-modal'
    };

    this.getDeleteMethod = function(organization) {
        return function(o) {
          commonModal.show(that.modalDefaults,that.modalOptions).then(function() {
            organizationResource.delete(o, function() {
      var store = $window.localStorage;
      store.removeItem('vm.organization');  
      console.log(store);              
              notificator.success('Organization was successfully deleted');
              $state.go('app.dashboard');
            });
          });
        };
    }
  }
})();
