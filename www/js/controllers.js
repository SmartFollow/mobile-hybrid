angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopup, $state, AuthService, AUTH_EVENTS) {
    $scope.username = AuthService.username();

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: 'Unauthorized!',
            template: 'You are not allowed to access this resource.'
        });
      });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Session Lost!',
            template: 'Sorry, You have to login again.'
        });
      });

    $scope.setCurrentUsername = function(name) {
        $scope.username = name;
    };
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService, $http, $window) {
    $scope.data = {};

    $scope.$on('$ionicView.enter', function () {
      if (!localStorage.reloadForLogin) {
        localStorage.setItem("reloadForLogin", "true");
        $window.location.reload();
      }
    });

    $scope.login = function(data) {
        AuthService.login($scope.data.username, $scope.data.password)
           .success(function(data) {
                $state.go('tab.profile', {});
            })
            .error(function(data, status) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            });
        };
})

.controller('ProfileCtrl', function($scope, UserService, $ionicActionSheet, AuthService, $state, API_NAME) {

    $scope.avatarLinkApi = API_NAME.link;
    UserService.getUser(function (data) {
        $scope.currentUser = data;
    });

    $scope.date_today = {
        value: new Date()
    };

    function addDays(theDate, days) {
        return new Date(theDate.getTime() + days*24*60*60*1000);
    }
    $scope.date = new Date();
    $scope.date_plus_1 = addDays(new Date(), 1);
    $scope.date_plus_2 = addDays(new Date(), 2);
    $scope.date_plus_3 = addDays(new Date(), 3);
    $scope.date_plus_4 = addDays(new Date(), 4);
    $scope.date_plus_5 = addDays(new Date(), 5);
    $scope.date_plus_6 = addDays(new Date(), 6);

    UserService.getLessons(function (data) {
        $scope.lesson = data;
    });

    UserService.getUserAccessRules(function (data) {
      $scope.accessRules = data;
      console.log(data);
    });

    UserService.getEvaluations(function (data) {
        $scope.evaluations = data;
    });

    UserService.getHomework(function (data) {
        $scope.homeworks = data;
    });

    UserService.getExams(function (data) {
        $scope.exams = data;
    })

    $scope.sliderOptions = {
    pager: true,
    autoHeight: true
    };

    // Triggered on a the logOut button click
    $scope.showLogOutMenu = function() {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            destructiveText: 'Logout',
            titleText: 'Voulez vous vraiment vous déconnecter ?',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                return true;
            },
            destructiveButtonClicked: function(){
                AuthService.logout();
                localStorage.clear();
                $state.go('login', {}, {reload: true});
            }
        });

    };
})

.controller('LessonDetailCtrl', function($scope, $stateParams, UserService) {
    UserService.getLesson($stateParams.lessonId, function (data) {
        $scope.lessons = data;

    });
    UserService.getUser(function (data) {
        $scope.currentUser = data;
    });

    UserService.getUserAccessRules(function (data) {
      $scope.accessRules = data;
    });
})

.controller('DocumentDetailCtrl', function($scope, $stateParams, UserService) {
    UserService.getDocument($stateParams.lessonId, $stateParams.docId, function (data) {
        $scope.doc = data;
    });
})

// NOTIFICATION
.controller('NotificationCtrl', function (Notification, getNotifications, $window) {
  var vm = this;

  vm.notifications = getNotifications.self_notifications;
  console.log(vm.notifications);
  vm.readNotif = function (notifId) {
    Notification.readNotification(notifId).then(function () {
      $window.location.reload();
    })
  };

})

// CONVERSATION
.controller('ConversationDetailCtrl', function($scope, $stateParams, Conversation, getConversation, UserService, message, $window) {
  var vm = this;

  UserService.getUser(function (data) {
    vm.currentUser = data;
  });

  vm.isNew = !message;
  vm.newMessage = message || {};
  vm.conversation = getConversation;

  vm.addMessage = function () {
    vm.newMessage.creator_id = vm.currentUser.id;
    vm.newMessage.conversation_id = vm.conversation.id;
    Conversation.addMessage(vm.newMessage).then(function () {
      $window.location.reload();
    });
  };

})

.controller('ConversationCtrl', function($scope, Conversation, getConversations, $window, API_NAME) {
  var vm = this;
  vm.conversations = getConversations;
  vm.avatarLinkApi = API_NAME.link;


  $scope.$on('$ionicView.enter', function () {
    if (!localStorage.justOnce) {
      localStorage.setItem("justOnce", "true");
      $window.location.reload();
    }
  });
})

.controller('NewConversationCtrl', function(conversation, Conversation, getAllUsers, UserService, $state, $timeout, getAllConversations){
  var vm = this;

  vm.isNew = !conversation;
  vm.users = vm.isNew ? getAllUsers : getAllUsers;
  vm.allConv = getAllConversations;

  UserService.getUser(function (data) {
    vm.currentUser = data;
  });

  vm.newConversation = conversation || {};
  var ids = [];

  vm.add = function () {
    vm.add.ongoing = true;
    angular.forEach(vm.newConversation.participants, function(tag, key) {
      this.push(tag.id);
    }, ids);
    vm.newConversation.creator_id = vm.currentUser.id;
    vm.newConversation.participants = ids;
    ids = [];

    Conversation[vm.isNew ? 'addConversation' : 'updateConversation'](vm.newConversation, vm.newConversation.id).then(function () {
      vm.add.ongoing = false;

      vm.refreshConversation();
      localStorage.clear();
      $state.go('tab.chats', {}, { reload: true });
    });
  };

  vm.delete = function () {
    Conversation.deleteConversation(vm.newConversation.id).then(function () {
      vm.refreshConversation();
      localStorage.clear();
      $timeout(function(){
        $state.go('tab.chats', {}, { reload: true });
      }, 200);
    });
  };

  vm.refreshConversation = function (callback) {
    Conversation.getConversations().then(function (res) {
      console.log(res);
      vm.allConv = res;
      if (callback) {
        callback();
      }
    });
  };
})

// Date filter

.filter('dayMonth', function dayMonth($filter){
  return function(text){
    var  tempdate = new Date(text);
    return $filter('date')(tempdate, "dd-MM");
  };
})

.filter('dayMonthYear2', function dayMonth($filter){
  return function(text){
    var  tempdate = new Date(text);
    return $filter('date')(tempdate, "EEEE dd MMMM");
  };
})


.filter('dayMonthYear', function dayMonthYear($filter){
  return function(text){
    var  tempdate = new Date(text);
    return $filter('date')(tempdate, "dd-MM-yyyy");
  };
})

.filter('dayMonthYear2', function dayMonthYear($filter){
  return function(text){
    var  tempdate = new Date(text);
    return $filter('date')(tempdate, "dd / MM / yyyy");
  };
})

.filter('hours', function hours($filter){
  return function(text){
    var  tempdate = new Date(text);
    return $filter('date')(tempdate, "HH");
  };
});
