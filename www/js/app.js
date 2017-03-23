/* global LoginService, $state, $ionicPopup */

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.constants'])
 
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })
  
    // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/side-menu.html',
    controller: 'DashCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'DashCtrl'
      }
    }
  })
  
  .state('tab.note-detail', {
    url: '/dash/:noteId/:noteMatter',
    views: {
      'menuContent': {
        templateUrl: 'templates/note-detail.html',
        controller: 'NoteDetailCtrl'
      }
    }
  })
  .state('tab.schedule', {
    url: '/schedule',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-schedule.html',
        controller: 'ScheduleCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'AccountCtrl'
      }
    }
  });
  
  
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("login");
  });
 });
