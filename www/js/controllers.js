angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicPopup, $state, AuthService, AUTH_EVENTS) {
    $scope.username = AuthService.username();

    // $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
    //   var alertPopup = $ionicPopup.alert({
    //     title: 'Unauthorized!',
    //     template: 'You are not allowed to access this resource.'
    //   });
    // });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    });

    $scope.setCurrentUsername = function (name) {
      $scope.username = name;
    };
  })

  .controller('LoginCtrl', function ($scope, $state, $ionicPopup, AuthService, $http, $window) {
    $scope.data = {};

    $scope.$on('$ionicView.enter', function () {
      if (!localStorage.reloadForLogin) {
        localStorage.setItem("reloadForLogin", "true");
        $window.location.reload();
      }
    });

    $scope.login = function (data) {
      AuthService.login($scope.data.username, $scope.data.password)
        .success(function (data) {
          $state.go('tab.profile', {});
        })
        .error(function (data, status) {
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        });
    };
  })

  .controller('ProfileCtrl', function ($scope, UserService, $ionicActionSheet, AuthService, $state, API_NAME) {

    $scope.avatarLinkApi = API_NAME.link;
    UserService.getUser(function (data) {
      $scope.currentUser = data;

      // Generating alert messages
      if (angular.isDefined($scope.currentUser.alerts))
        $scope.currentUser.alerts.forEach(function (alert) {
          var message = "Vos " + alert.criterion.name.toLowerCase() + (alert.criterion.name[alert.criterion.name.length - 1] == 's' ? '' : 's');
          if (alert.previous_student_value !== null) {
            message +=  " ont ";
            message += (alert.student_value >= alert.previous_student_value ? 'augmenté' : 'baissé') + " depuis la dernière évaluation, ";
          }
          else {
            message +=  " sont ";
            message += (alert.student_value >= alert.class_value ? 'supérieurs' : 'inférieurs') + " à votre classe, ";
          }
          message += { success: 'félicitations', info: 'continuez ainsi', warning: 'attention', danger: 'attention' }[alert.type] + " !";

          alert.message = message;
        });

      console.log(data);
    });



    $scope.date_today = {
      value: new Date()
    };

    function addDays(theDate, days) {
      return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
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
    });

    UserService.getEvaluations(function (data) {
      $scope.evaluations = data;
    });

    UserService.getHomework(function (data) {
      $scope.homeworks = data;
    });

    // UserService.getExams(function (data) {
    //     $scope.exams = data;
    // });

    $scope.sliderOptions = {
      pager: true,
      autoHeight: true
    };

    // Triggered on a the logOut button click
    $scope.showLogOutMenu = function () {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Logout',
        titleText: 'Voulez vous vraiment vous déconnecter ?',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          return true;
        },
        destructiveButtonClicked: function () {
          AuthService.logout();
          localStorage.clear();
          $state.go('login', {}, {reload: true});
        }
      });

    };
  })

  .controller('DocumentDetailCtrl', function ($scope, $stateParams, UserService) {
    UserService.getDocument($stateParams.lessonId, $stateParams.docId, function (data) {
      $scope.doc = data;
    });
  })

  // NOTIFICATION
  .controller('NotificationCtrl', function (Notification, getNotifications, $window) {
    var vm = this;

    vm.notifications = getNotifications.self_notifications;
    vm.readNotif = function (notifId, notif) {
      Notification.readNotification(notifId).then(function () {
        var i = vm.notifications.indexOf(notif);
        if (i !== -1) {
          vm.notifications.splice(i, 1);
        }
      })
    };

  })

  // CONVERSATION
  .controller('ConversationDetailCtrl', function ($scope, $stateParams, Conversation, getConversation, UserService, message, $window) {
    var vm = this;

    UserService.getUser(function (data) {
      vm.currentUser = data;
    });

    vm.isNew = !message;
    vm.newMessage = message || {};
    vm.conversation = getConversation;
    console.log(vm.conversation);

    vm.addMessage = function () {
      vm.newMessage.creator_id = vm.currentUser.id;
      vm.newMessage.conversation_id = vm.conversation.id;
      Conversation.addMessage(vm.newMessage).then(function () {
        vm.conversation.messages.push(vm.newMessage);
        vm.newMessage = {};
      });
    };

  })

  .controller('ConversationCtrl', function ($scope, Conversation, getConversations, $window, API_NAME) {
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

  .controller('NewConversationCtrl', function (conversation, Conversation, getAllUsers, UserService, $state, $timeout, getAllConversations) {
    var vm = this;

    vm.isNew = !conversation;
    vm.allConv = getAllConversations;

    UserService.getUser(function (data) {
      vm.currentUser = data;
    });

    vm.users = vm.isNew ? getAllUsers.users : getAllUsers.users;
    vm.newConversation = conversation || {};
    var ids = [];

    vm.add = function () {
      vm.add.ongoing = true;
      angular.forEach(vm.newConversation.participants, function (tag, key) {
        this.push(tag.id);
      }, ids);
      vm.newConversation.creator_id = vm.currentUser.id;
      vm.newConversation.participants = ids;
      ids = [];

      Conversation[vm.isNew ? 'addConversation' : 'updateConversation'](vm.newConversation, vm.newConversation.id).then(function () {
        vm.add.ongoing = false;

        vm.refreshConversation();
        localStorage.clear();
        $state.go('tab.chats', {}, {reload: true});
      });
    };

    vm.delete = function () {
      Conversation.deleteConversation(vm.newConversation.id).then(function () {
        vm.refreshConversation();
        localStorage.clear();
        $timeout(function () {
          $state.go('tab.chats', {}, {reload: true});
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

  .controller('LessonDetailCtrl', function ($scope, $cordovaFileTransfer, $window, HomeworkFactory, $ionicModal, $stateParams, UserService, API_NAME, $state, $rootScope, $http, $filter, EvaluationFactory) {

    $scope.config = API_NAME;

    EvaluationFactory.getCreateFormData($stateParams.id, function (data) {
      $scope.criteria = data.criteria;
    });

    UserService.getLesson($stateParams.id, function (lesson) {
      $scope.lesson = lesson;

      $scope.lesson.start = new Date($scope.lesson.start.replace('/-/g', "/"));
      $scope.lesson.end = new Date($scope.lesson.end.replace('/-/g', "/"));
      if ($scope.lesson.subject.teacher)
        $scope.lesson.subject.teacher.avatar = API_NAME.link + $scope.lesson.subject.teacher.avatar;
    });

    $ionicModal.fromTemplateUrl('templates/modal-exam.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('templates/modal-homework-create.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-homework-info.html', {
      id: '3', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal3 = modal;
    });

    $scope.openModal = function(index, homework) {
      if (homework) $scope.homeworkToShow = homework;
      if (index === 1) $scope.oModal1.show();
      else if (index === 2) $scope.oModal2.show();
      else $scope.oModal3.show();
    };

    $scope.closeModal = function(index) {
      if (index === 1) $scope.oModal1.hide();
      else if (index === 2) $scope.oModal2.hide();
      else $scope.oModal3.hide();
    };


    $scope.fileDownload = function(document) {
      var url = $scope.config.link + document.path;
      console.log(url);
      var filename = document.filename + '.' + document.extension;

      var targetPath = cordova.file.externalRootDirectory + filename;

      $cordovaFileTransfer.download(url, targetPath, {}, true).then(function(result) {
        //console.log('Success');
        $scope.hasil = 'Save file on ' + targetPath + ' success!';
        $scope.mywallpaper = targetPath;
        alert('Your download is completed');
      }, function(error) {
        //console.log('Error downloading file');
        $scope.hasil = 'Error downloading file...';
        alert('Your download is failed');
      }, function(progress) {
        console.log('progress');
        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        // var downcountString = $scope.downloadProgress.toFixed();
        // console.log('downcountString');
        // $scope.downloadCount = downcountString;
      });
    };

    /**
     * Updating the status (present / absent / delay) of a student
     *
     * @param student
     */
    $scope.updateStatus = function (student) {
      if (!student.inUpdate) {
        student.inUpdate = true;
        $scope.execAfterEvaluationExists(student, function (student) {
          if (student.lesson_evaluation.absence) {
            EvaluationFactory.storeDelay(student.lesson_evaluation.id, function (delay) {
              student.lesson_evaluation.absence = null;
              student.lesson_evaluation.delay = delay;
              student.inUpdate = false;
            });
          }
          else if (student.lesson_evaluation.delay) {
            EvaluationFactory.deleteDelay(student.lesson_evaluation.id, student.lesson_evaluation.delay.id, function (data) {
              student.lesson_evaluation.delay = null;
              student.inUpdate = false;
            });
          }
          else {
            EvaluationFactory.storeAbsence(student.lesson_evaluation.id, function (absence) {
              student.lesson_evaluation.absence = absence;
              student.inUpdate = false;
            });
          }
        });
      }
    };

    /**
     * Change the value of the criterion evaluation for a specific student by
     * the value of "valueUpdate"
     *
     * @param student
     * @param criterion
     * @param valueUpdate
     */
    $scope.updateEvaluationCriterion = function (student, criterion, valueUpdate) {
      if (!student.inUpdate) {
        student.inUpdate = true;
        $scope.execAfterEvaluationExists(student, function (student) {

          var criterionEvaluation = student.lesson_evaluation.criteria.filter(e => e.id == criterion.id);
          criterionEvaluation = criterionEvaluation && criterionEvaluation.length > 0 ? criterionEvaluation[0] : null;

          if (criterionEvaluation) { // This criterion already has an evaluation, update the value
            var newValue = criterionEvaluation.pivot.value + valueUpdate;
            newValue = newValue < 0 ? 0 : newValue;

            EvaluationFactory.updateCriterionEvaluation(student.lesson_evaluation.id, criterion.id, {value: newValue}, function (criteria) {
              student.lesson_evaluation.criteria = criteria;
              student.inUpdate = false;
              $scope.dispCriteria = false;
            });
          }
          else { // This criterion doesn't have an evaluation, create the evaluation
            EvaluationFactory.storeCriterionEvaluation(student.lesson_evaluation.id, {
              criterion_id: criterion.id,
              value: 1
            }, function (criteria) {
              student.lesson_evaluation.criteria = criteria;
              student.inUpdate = false;
              $scope.dispCriteria = false;
            });
          }
        });
      }
    };

    /**
     * Update an evaluation's comment
     *
     * @param student
     */
    $scope.updateComment = function (student) {
      if (!student.inUpdate) {
        student.inUpdate = true;
        $scope.execAfterEvaluationExists(student, function (student) {
          EvaluationFactory.updateEvaluation(student.lesson_evaluation.id, {
            comment: student.lesson_evaluation.comment
          }, function (evaluation) {
            student.inUpdate = false;
          });
        });
      }
    };

    /**
     * Execute a function after making sure the student evaluation exists
     * or after creating it otherwise
     *
     * @param student
     * @param callback
     */
    $scope.execAfterEvaluationExists = function (student, callback) {
      if (!student.lesson_evaluation) {
        EvaluationFactory.storeEvaluation({
          student_id: student.id,
          lesson_id: $stateParams.id
        }, function (evaluation) {
          student.lesson_evaluation = evaluation;
          callback(student);
        });
      }
      else
        callback(student);
    };

    /**
     * Return the criterion evaluation from the specified criterion from an evaluation
     *
     * @param evaluation
     * @param criterion
     * @returns {null}
     */
    $scope.criterionFromEvaluation = function (evaluation, criterion) {
      if (!evaluation || !criterion)
        return null;

      var result = evaluation.criteria.filter(e => e.id == criterion.id);

      return result && result.length > 0 ? result[0] : null;
    };

    $scope.setEditHomework = function (homework) {
      $scope.editHomework = homework;
    };

    $scope.setShowHomework = function (homework) {
      $scope.showHomework = homework;
    };

    $scope.setEditDocument = function (document) {
      $scope.editDocument = document;
    };

    $scope.setShowDocument = function (document) {
      $scope.showDocument = document;
    };

    $scope.deleteHomework = function (lessonId, id) {
      HomeworkFactory.deleteHomework(lessonId, id, function () {
        $window.location.reload();
      });
    };

    $scope.createHomework = {};

    $scope.storeHomework = function (lessonId) {
      HomeworkFactory.storeHomework(lessonId, {
        description: $scope.createHomework.description,
        document_id: $scope.createHomework.document_id
      }, function (homework) {
        $scope.createHomework = {};

        $scope.lesson.homeworks.push(homework);
      });
    };

    $scope.updateHomework = function (lessonId) {
      HomeworkFactory.updateHomework(lessonId, $scope.homeworkToShow.id, {
        description: $scope.homeworkToShow.description,
        document_id: $scope.homeworkToShow.document_id || undefined
      }, function (homework) {
        $scope.homeworkToShow = homework;

        $scope.lesson.homeworks[$scope.lesson.homeworks.findIndex(e => e.id == homework.id)] = homework;
      });
    };

    $scope.tabId = 1;
    $scope.tabClick = function (nb) {
      $scope.tabId = nb;
    };

    $scope.dispCriteria = false;
    $scope.displayCriteria = function () {
      $window.onclick = null;
      $scope.dispCriteria = true;

      if ($scope.dispCriteria) {
        $window.onclick = function (event) {
          $scope.dispCriteria = false;
          $scope.$apply();
        };
      }
    };

    UserService.getUserAccessRules(function (data) {
      $scope.accessRules = data;
    });
  })

  // Date filter

  .filter('dayMonth', function dayMonth($filter) {
    return function (text) {
      var tempdate = new Date(text);
      return $filter('date')(tempdate, "dd-MM");
    };
  })

  .filter('dayMonthYear2', function dayMonth($filter) {
    return function (text) {
      var tempdate = new Date(text);
      return $filter('date')(tempdate, "EEEE dd MMMM");
    };
  })


  .filter('dayMonthYear', function dayMonthYear($filter) {
    return function (text) {
      var tempdate = new Date(text);
      return $filter('date')(tempdate, "dd-MM-yyyy");
    };
  })

  .filter('dayMonthYear2', function dayMonthYear($filter) {
    return function (text) {
      var tempdate = new Date(text);
      return $filter('date')(tempdate, "dd / MM / yyyy");
    };
  })

  .filter('hours', function hours($filter) {
    return function (text) {
      var tempdate = new Date(text);
      return $filter('date')(tempdate, "HH");
    };
  })

  .filter('acronym', function () {
    return function (str) {
      return str.split(' ').map(e => e[0]).join('');
    }
  });
