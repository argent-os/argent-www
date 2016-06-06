(function() {
    'use strict';
    // THIS FILE IS IS IGNORED BY .ebignore AND .gitignore TO PREVENT ACCIDENTAL CHANGES TO API ROOT URL CONFIG IN PRODUCTION
    var app = angular.module('app', [
        'app.entity'
    ])
    // DEFAULT USED AT LOGIN ** EDIT THIS BEFORE RELEASING PRODUCTION // EDIT IP TO RUN LOCALLLY OVER NETWORK
    .value('appconfig',{
            apiRoot: 'http://192.168.1.232:5001',
            firebaseUrl: ''
    })
    .config(['stripeProvider', 'notificationsConfigProvider', function (stripeProvider, notificationsConfigProvider) {
        // ***CHANGE STRIPE KEY BEFORE RELEASING PRODUCTIONS***
        // Prod Stripe Pub Key
        // stripeProvider.setPublishableKey('pk_live_9kfmn7pMRPKAYSpcf1Fmn266');
        // Dev Stripe Pub Key
        stripeProvider.setPublishableKey('pk_test_6MOTlPN5JrNS5dIN4DUeKFDA');
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
                appconfig.apiRoot = 'http://192.168.1.232:5001';
                appconfig.firebaseUrl = ''
            } else if(res.data.env == 'PROD') {
                appconfig.apiRoot = 'http://proton-api-dev.us-east-1.elasticbeanstalk.com/';
                appconfig.firebaseUrl = ''
            }
        })
    }])


})();

// (function() {
//     'use strict';
//     // THIS FILE IS IS IGNORED BY .ebignore AND .gitignore TO PREVENT ACCIDENTAL CHANGES TO API ROOT URL CONFIG IN PRODUCTION
//     var app = angular.module('app', [
//         'app.entity'
//     ])
//     // DEFAULT USED AT LOGIN ** EDIT THIS BEFORE RELEASING PRODUCTION
//     // API endpoints
//     // http://api.paykloud.com
//     // http://dev.paykloud.com
//     // http://paykloud-api-dev.us-east-1.elasticbeanstalk.com
//     .value('appconfig',{
//             apiRoot: 'http://paykloud-api-dev.us-east-1.elasticbeanstalk.com',
//             firebaseUrl: 'https://paykloud.firebaseio.com/api/v1'
//     })
//     .config(['stripeProvider', 'notificationsConfigProvider', function (stripeProvider, notificationsConfigProvider) {
//         // ***CHANGE STRIPE KEY BEFORE RELEASING PRODUCTIONS***
//         // Prod Stripe Pub Key
//         stripeProvider.setPublishableKey('pk_live_9kfmn7pMRPKAYSpcf1Fmn266');
//         // auto hide
//         notificationsConfigProvider.setAutoHide(true);

//         // delay before hide
//         notificationsConfigProvider.setHideDelay(3000);

//         // support HTML
//         notificationsConfigProvider.setAcceptHTML(false);
   
//     }])
//     .run(['$http', '$rootScope','appconfig', 'UserFactory', function($http, $rootScope, appconfig, UserFactory) {
//         UserFactory.getProfile().then(function (res) {
//             if(res.data.env == 'DEV') {
//                 appconfig.apiRoot = 'http://localhost:5001';
//                 appconfig.firebaseUrl = 'https://demosandbox.firebaseio.com/api/v1'
//             } else if(res.data.env == 'PROD') {
//                 appconfig.apiRoot = 'http://paykloud-api-dev.us-east-1.elasticbeanstalk.com';
//                 appconfig.firebaseUrl = 'https://paykloud.firebaseio.com/api/v1'
//             }
//         })
//     }])
// })();
