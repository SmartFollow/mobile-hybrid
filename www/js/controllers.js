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

    $scope.submit = function () {
    
    var user = {
      username: $scope.inputEmail,
      password: $scope.inputPassword
    }
    var options = {
      grant_type: "password",
      scope: ""
    } 
    var data = OAuth.getAccessToken(user, options);
    data.then(function(data) {
        $window.location.reload();
    });
  }
 
    $scope.login = function(data) {
        $Username =  $scope.data.username;
        AuthService.login($scope.data.username, $scope.data.password).then(function() {
            $state.go('tab.profile', {$Username});
        }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    };
})

.controller('ProfileCtrl', function($scope, UserService) {
    UserService.getUser(function (data) {
        $scope.currentUser = data;
        $scope.imgUser = "img/ben.png";
    });

    UserService.getLesson(function (data) {
        $scope.lesson = data;
    });

    UserService.getHomework(function (data) {
        $scope.homework = data;
    });
    
    UserService.getNotes().success(function (data) {
        $scope.allNotes = data;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
        });
    });



    $scope.data = {};
    $scope.data.currentPage = 0;

    var setupSlider = function() {
        //some options to pass to our slider
        $scope.data.sliderOptions = {
          initialSlide: 0,
          direction: 'horizontal', //or vertical
          speed: 300 //0.3s transition
        };

        //create delegate reference to link with slider
        $scope.data.sliderDelegate = null;

        //watch our sliderDelegate reference, and use it when it becomes available
        $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
          if (newVal != null) {
            $scope.data.sliderDelegate.on('slideChangeEnd', function() {
              $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
              //use $scope.$apply() to refresh any content external to the slider
              $scope.$apply();
            });
          }
        });
    };

    setupSlider();

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

// SETTINGS
.controller('AccountCtrl', function($scope, $ionicActionSheet, $state, AuthService) {
    $scope.airplaneMode = true;
    $scope.wifi = false;
    $scope.bluetooth = true;
    $scope.personalHotspot = true;

    $scope.checkOpt1 = true;
    $scope.checkOpt2 = true;
    $scope.checkOpt3 = false;

    $scope.radioChoice = 'B';
    $scope.logout = function() {
        AuthService.logout();
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
                $scope.logout();
                $state.go('login', {});
            }
        });

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
})

.controller('lessonsId', [ '$scope', '$state', '$rootScope', '$http', '$filter', '$stateParams', function ($scope, $state, $rootScope, $http, $filter, $stateParams) {
    $http({
            method: 'GET',
            url: "http://api.dev.smartfollow.lan/api/lessons/"+$stateParams.id
        }).then(function successCallback(response) {
            $scope.lesson = response.data;
            console.log(response);
        }, function errorCallback(response) {
            console.log(response);
    });

    $scope.create = function () {
        var file = {
                    name: $("#name").val(),
                    description: $("#description").val(),
                    document: $("#document")[0].files[0]
                };
        $http({
            method: 'POST',
            url: "http://api.dev.smartfollow.lan/api/lessons/"+$stateParams.id+"/documents",
            data: file
        }).then(function successCallback(response) {
            $state.reload();
            console.log(response);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.createHW = function () {
        console.log($("#HWdescription").val());
        var file = {
                    description: $("#HWdescription").val()
                };
        $http({
            method: 'POST',
            url: "http://api.dev.smartfollow.lan/api/lessons/"+$stateParams.id+"/homeworks",
            data: file
        }).then(function successCallback(response) {
            $state.reload();
            console.log(response);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.createExam = function () {
        console.log($("#examDescription").val());
        var file = {
                    type: $("#examType").val(),
                    min_mark: $("#examMin").val(),
                    max_mark: $("#examMax").val(),
                    description: $("#examDescription").val()
                };
        $http({
            method: 'POST',
            url: "http://api.dev.smartfollow.lan/api/lessons/"+$stateParams.id+"/exam",
            data: file
        }).then(function successCallback(response) {
            $state.reload();
            console.log(response);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.evaluations = function (key, student) {
        if ($("#student-"+key).find('.time-lesson').is(":hidden") && $("#student-"+key).find('.cross-lesson').is(":hidden"))
        {
            // Si en retard
            $("#student-"+key).find('.time-lesson').show();
            var file = {
                    student_id: student.id
                };
            $http({
            method: 'POST',
            url: "http://api.dev.smartfollow.lan/api/lessons/"+$stateParams.id+"/evaluations",
            data: file
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.log(response);
            });

        }
        else if ($("#student-"+key).find('.time-lesson').is(":hidden") && $("#student-"+key).find('.cross-lesson').is(":visible"))
        {
            // Annulation de l'absence
            $("#student-"+key).find('.time-lesson').hide();
            $("#student-"+key).find('.cross-lesson').hide();
        }
        else
        {
            // Si absent
            $("#student-"+key).find('.time-lesson').hide();
            $("#student-"+key).find('.cross-lesson').show();
        }
    };
}]);