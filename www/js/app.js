/* global LoginService, $state, $ionicPopup */

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic.cloud','starter.controllers', 'starter.services', 'starter.constants', 'ngAnimate', 'ionic-modal-select'])


.config(function($ionicCloudProvider) {
  $ionicCloudProvider.init({
    "core": {
      "app_id": "a0280805"
    }
  });
})

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
    if(window.cordova){
      var push = new Ionic.Push({
        "debug": false,
        "onNotification": function(notification) {
          //Do something when you receive a notification
          console.log(notification);
        }
      });

      var callback = function(pushToken) {
        //Save the token specified to the device
        //this token is saved in the Ionic.io database
        push.saveToken(pushToken.token);
      };

      //register you device to your app notification system
      push.register(callback);
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
    controller: 'ProfileCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.all-notes', {
    url: '/notes',
    views: {
      'menuContent': {
        templateUrl: 'templates/all-notes.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.lesson-details', {
    url: '/lesson/:lessonId',
    views: {
      'menuContent': {
        templateUrl: 'templates/lesson-detail.html',
        controller: 'LessonDetailCtrl'
      }
    }
  })

  .state('tab.lessons', {
    url: '/lessons',
    views: {
      'menuContent': {
        templateUrl: 'templates/all-lessons.html',
        controller: 'ProfileCtrl'
      }
    }
  })
    .state('tab.all-lessons', {
    url: '/all/lessons',
    views: {
      'menuContent': {
        templateUrl: 'templates/all-lessons.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.doc-details', {
    url: '/doc/:lessonId/:docId',
    views: {
      'menuContent': {
        templateUrl: 'templates/doc-detail.html',
        controller: 'DocumentDetailCtrl'
      }
    }
  })

  // NOTIFICATIONS
  .state('tab.notifications', {
    url: '/notifications',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-notifications.html',
        controller: 'NotificationCtrl as notifCtrl'
      }
    },
    resolve: {
      getNotifications: function (Notification) {
        return Notification.getNotifications();
      }
    }
  })

   // CONVERSATION
  .state('tab.chats', {
    url: '/chats',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ConversationCtrl as conversationCtrl'
      }
    },
    resolve: {
      getConversations: function (Conversation) {
        return Conversation.getConversations();
      }
    }
  })

  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'menuContent': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ConversationDetailCtrl as convDetailCtrl'
      }
    },
    resolve: {
      message: function () {
        return null;
      },
      getConversation: function (Conversation, $stateParams) {
        return Conversation.getConversation($stateParams.chatId);
      }
    }
  })

  .state('tab.new-conversation', {
    url: '/new/conversation',
    views: {
      'menuContent': {
        templateUrl: 'templates/chat-new-conversation.html',
        controller: 'NewConversationCtrl as newConversationCtrl'
      }
    },
    resolve: {
      conversation: function () {
        return null;
      },
      getAllUsers: function (Conversation) {
        return Conversation.getAllUsers();
      },
      getAllConversations: function (Conversation) {
        return Conversation.getConversations();
      }
    }
  })

    .state('tab.conversation-settings', {
      url: '/chats/:chatId/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat-settings.html',
          controller: 'NewConversationCtrl as newConversationCtrl'
        }
      },
      resolve: {
        conversation: function (Conversation, $stateParams) {
          return Conversation.getConversation($stateParams.chatId);
        },
        getAllUsers: function (Conversation) {
          return Conversation.getAllUsers();
        },
        getAllConversations: function (Conversation) {
          return Conversation.getConversations();
        }
      }
    })

  .state('tab.evaluation', {
    url: '/evaluation',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-eval.html',
        controller: 'ProfileCtrl'
      }
    }
  });


  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("login");
  });
 });
