(function() {
    'use strict';
    // THIS FILE IS IS IGNORED BY .ebignore AND .gitignore TO PREVENT ACCIDENTAL CHANGES TO API ROOT URL CONFIG IN PRODUCTION
    var app = angular.module('app', [
        'app.entity'
    ])
    // DEFAULT USED AT LOGIN ** EDIT THIS BEFORE RELEASING PRODUCTION // EDIT IP TO RUN LOCALLLY OVER NETWORK
    .value('appconfig',{
            apiRoot: 'https://api.argent.cloud'
    })
    .config(['stripeProvider', 'notificationsConfigProvider', function (stripeProvider, notificationsConfigProvider) {
        // ***CHANGE STRIPE KEY BEFORE RELEASING PRODUCTIONS***
        // Prod Stripe Pub Key
        stripeProvider.setPublishableKey('pk_live_9kfmn7pMRPKAYSpcf1Fmn266');
        // Dev Stripe Pub Key
        // stripeProvider.setPublishableKey('pk_test_6MOTlPN5JrNS5dIN4DUeKFDA');

        // auto hide
        notificationsConfigProvider.setAutoHide(true);

        // delay before hide
        notificationsConfigProvider.setHideDelay(3000);

        // support HTML
        notificationsConfigProvider.setAcceptHTML(false);
   
    }])
    .run(['$http', '$rootScope','appconfig', 'UserFactory', function($http, $rootScope, appconfig, UserFactory) {
        UserFactory.getProfile().then(function (res) {
            if(res.data.env == 'DEV') {
                appconfig.apiRoot = 'https://dev.argent.cloud';
            } else if(res.data.env == 'PROD') {
                appconfig.apiRoot = 'https://api.argent.cloud';
            }
        })
    }])


})();