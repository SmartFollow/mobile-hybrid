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

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
    $scope.data = {};
 
    $scope.login = function(data) {
        AuthService.login($scope.data.username, $scope.data.password).then(function() {
            $state.go('tab.profile', {});
        }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    };
})


.controller('DashCtrl', function($scope, UserService, $ionicPopup) {
    UserService.getUser().success(function (data) {
        $scope.user = data;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
        });
    });
    UserService.getNotes().success(function (data) {
        $scope.allNotes = data;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
        });
    });
})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $state, AuthService) {
    $scope.settings = {
        enableFriends: true
    };
    $scope.logout = function() {
        AuthService.logout();
        $state.go('login', {});
    };
})

.controller('ScheduleCtrl', function($scope, ScheduleService) {
    ScheduleService.get().success(function (data) {
        $scope.schedule = data;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Error!',
            template: 'Please check your credentials!'
        });
    });
})

.controller('NoteDetailCtrl', function($scope, $stateParams, UserService) {
    $scope.note = UserService.getNote($stateParams.noteMatter, $stateParams.noteId);
});