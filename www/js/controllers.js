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

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService, $http) {
    $scope.data = {};

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
        }
})

.controller('ProfileCtrl', function($scope, UserService, $ionicActionSheet, AuthService, $state) {
    UserService.getUser(function (data) {
        $scope.currentUser = data;
        $scope.imgUserStudent = "img/ben.png";
        $scope.imgUserTeacher = "img/adam.jpg";
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

    UserService.getEvaluations(function (data) {
        $scope.evaluations = data;
    });

    UserService.getHomework(function (data) {
        $scope.homeworks = data;
    });

    UserService.getNotifications(function (data) {
      $scope.notifications = data;
    });

    $scope.sliderOptions = {
    pager: true,
    autoHeight: true
    };

    // Triggered on a the logOut button click
    $scope.showLogOutMenu = function() {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            destructiveText: 'Logout',
            titleText: 'Voulez vraiment vous déconnecter ?',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                return true;
            },
            destructiveButtonClicked: function(){
                AuthService.logout();
                $state.go('login', {});
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
})

.controller('DocumentDetailCtrl', function($scope, $stateParams, UserService) {
    UserService.getDocument($stateParams.lessonId, $stateParams.docId, function (data) {
        $scope.doc = data;
    });
})


// CONVERSATION
.controller('ConversationDetailCtrl', function($scope, $stateParams, Conversation, getConversation) {
  var vm = this;

  vm.conversation = getConversation;
  console.log(getConversation.participants);
})

.controller('ConversationCtrl', function($scope, Conversation, getConversations) {
  var vm = this;

  vm.conversations = getConversations;
})

.controller('NewConversationCtrl', function(conversation, Conversation, ngToast, getAllUsers, UserService, $state){
  var vm = this;

  vm.users = getAllUsers;
  vm.isNew = !conversation;

  UserService.getUser(function (data) {
    vm.currentUser = data;
  });

  vm.newConversation = conversation || {};

  var ids = [];

  vm.add = function () {
    vm.add.ongoing = true;
    angular.forEach(vm.tags, function(tag, key) {
      this.push(tag.id);
    }, ids);
    vm.newConversation.creator_id = vm.currentUser.id;
    vm.newConversation.participants = ids;
    ids = [];

    Conversation[vm.isNew ? 'addConversation' : 'updateConversation'](vm.newConversation, vm.newConversation.id).then(function () {
      vm.add.ongoing = false;
      console.log("toast");
      ngToast.create('Conversation bien sauvegardée');

      $state.go('tab.chats', {},  {reload: true});
    });
  };
})

.controller('NewMessageCtrl', function($scope, $recipient, NewMessage) {

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

.filter('hours', function hours($filter){
  return function(text){
    var  tempdate = new Date(text);
    return $filter('date')(tempdate, "HH");
  };
});
