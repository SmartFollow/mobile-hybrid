angular.module('starter.services', [])

  .service('AuthService', function ($q, $http, USER_ROLES, API_NAME, $window) {
    var username = '';
    var role = '';
    var authToken;
    var link = API_NAME.link + '/oauth/token';
    var isAuth = false;
    var deferred = $q.defer();

    var login = function (name, pw) {
      return $http.post(link, {
        grant_type: 'password', client_id: API_NAME.id,
        client_secret: API_NAME.secret,
        username: name, password: pw,
        scope: ''
      })
        .success(function (data, status, headers, config) {
          console.log('data success');
          storeUserCredentials(data.access_token);
          ;
          $window.sessionStorage.token = data.access_token;
          deferred.resolve('Login success.');
        })
        .error(function (data, status, headers, config) {
          console.log('data error');
          deferred.reject('Wrong credentials.');
        });
    }

    function storeUserCredentials(token) {
      useCredentials(token);
    }

    function useCredentials(token) {
      isAuth = true;
      authToken = token;
      role = USER_ROLES.teacher;
      $http.defaults.headers.common.Authorization = "Bearer " + token;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuth = false;
      $http.defaults.headers.common['Authorization'] = undefined;
      $window.sessionStorage.clear();
    }

    var logout = function () {
      destroyUserCredentials();
    };
    var isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (isAuth && authorizedRoles.indexOf(role) !== -1);
    };

    return {
      login: login,
      logout: logout,
      authToken: authToken,
      isAuthorized: isAuthorized,
      isAuthenticated: function () {
        return isAuthenticated;
      },
      username: function () {
        return username;
      },
      role: function () {
        return role;
      }
    };
  })

  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        return config;
      },
      response: function (response) {
        return response || $q.when(response);
      },
      responseError: function (response) {
        $rootScope.$broadcast({
          403: AUTH_EVENTS.notAuthorized
        }[response.status], response);
        return $q.reject(response);
      }
    };
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  })


  .service('UserService', ['$http', '$q', 'API_NAME', function ($http, $q, API_NAME) {
    var me = this;
    return {
        getUser: function(callback) {
            if(me.currentUser)
                callback(me.currentUser);
            $http({
                method: 'GET',
                url: API_NAME.link + '/api/users/profile'
            }).then(function(res){
                me.currentUser = res.data;
                callback(me.currentUser);
            });
        },
        getUserAccessRules: function (callback) {
            $http({
              method: 'GET',
              url: API_NAME.link + "/api/users/profile/access-rules"
            }).then(function successCallback(response) {
              callback(response.data);
            }, function errorCallback(response) {
              console.log(response);
            });
        },
        getLessons: function(callback)
        {
            if(me.currentUser)
                callback(me.currentUser);
            $http({
                method: 'GET',
                url: API_NAME.link + '/api/lessons'
            }).then(function(res){
                me.currentUser = res.data;
                callback(me.currentUser);
            });
        },
        getEvaluations: function(callback)
        {
            if(me.currentUser)
                callback(me.currentUser);
            $http({
                method: 'GET',
                url: API_NAME.link + '/api/evaluations'
            }).then(function(res){
                me.currentUser = res.data;
                callback(me.currentUser);
            });
          },
        getLesson: function (id, callback) {
          $http({
            method: 'GET',
            url: API_NAME.link + "/api/lessons/" + id
          }).then(function successCallback(response) {
            callback(response.data);
          }, function errorCallback(response) {
            console.log(response);
          });
        },
        getHomework: function(callback)
        {
            if(me.currentUser)
                callback(me.currentUser);
            $http({
                method: 'GET',
                url: API_NAME.link + '/api/lessons/1/homeworks'
            }).then(function(res){
                me.currentUser = res.data;
                callback(me.currentUser);
            });
        },
        getDocument: function(lessonId, docId, callback)
        {
            if(me.currentUser)
                callback(me.currentUser);
            $http({
                method: 'GET',
                url: API_NAME.link + '/api/lessons/' + lessonId + '/documents/' + docId
            }).then(function(res){
                me.currentUser = res.data;
                callback(me.currentUser);
            });
        },
        // getExams: function (lessonId, callback) {
        //   if(me.currentUser)
        //     callback(me.currentUser);
        //   $http({
        //     method: 'GET',
        //     url: API_NAME.link + '/api/lessons/' + lessonId + '/exams'
        //   }).then(function(res){
        //     me.currentUser = res.data;
        //     callback(me.currentUser);
        //   });
        // }
    };
  }])

  .factory('EvaluationFactory', ['$http', 'API_NAME', function ($http, API_NAME) {
    return {
      getCreateFormData: function (lessonId, callback) {
        $http({
          method: 'GET',
          url: API_NAME.link + "/api/lessons/" + lessonId + "/evaluations/create"
        }).then(function successCallback(response) {
          callback(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      },
      storeEvaluation: function (data, callback) {
        $http({
          method: 'POST',
          url: API_NAME.link + "/api/evaluations",
          data: data
        }).then(function successCallback(response) {
          callback(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      },
      storeAbsence: function (evaluationId, callback) {
        $http({
          method: 'POST',
          url: API_NAME.link + "/api/evaluations/" + evaluationId + "/absences"
        }).then(function successCallback(response) {
          callback(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      },
      storeDelay: function (evaluationId, callback) {
        $http({
          method: 'POST',
          url: API_NAME.link + "/api/evaluations/" + evaluationId + "/delays"
        }).then(function successCallback(response) {
          callback(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      },
      deleteDelay: function (evaluationId, delayId, callback) {
        $http({
          method: 'DELETE',
          url: API_NAME.link + "/api/evaluations/" + evaluationId + "/delays/" + delayId
        }).then(function successCallback(response) {
          callback(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      },
      storeCriterionEvaluation: function (evaluationId, data, callback) {
        $http({
          method: 'POST',
          url: API_NAME.link + "/api/evaluations/" + evaluationId + "/criteria",
          data: data
        }).then(function successCallback(response) {
          callback(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      },
      updateCriterionEvaluation: function (evaluationId, criterionId, data, callback) {
        $http({
          method: 'PUT',
          url: API_NAME.link + "/api/evaluations/" + evaluationId + "/criteria/" + criterionId,
          data: data
        }).then(function successCallback(response) {
          callback(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      },
      updateEvaluation: function (evaluationId, data, callback) {
        $http({
          method: 'PUT',
          url: API_NAME.link + "/api/evaluations/" + evaluationId,
          data: data
        }).then(function successCallback(response) {
          callback(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      }
    };
  }])

  .factory('Notification', function ($http, API_NAME) {
    return {
      getNotifications: function () {
        return $http.get(API_NAME.link + '/api/notifications').then(function (res) {
          return res.data;
        }, $http.fallback);
      },
      readNotification: function (notificationId) {
        return $http.put(API_NAME.link + '/api/notifications/' + notificationId + '/read').then(function (res) {
          return res.data;
        }, $http.fallback);
      }
    }
  })

  .factory('Conversation', function ($http, API_NAME) {
    return {
      getAllUsers: function () {
        return $http.get(API_NAME.link + '/api/users').then(function (res) {
          return res.data;
        }, $http.fallback);
      },
      getConversations: function () {
        return $http.get(API_NAME.link + '/api/conversations').then(function (res) {
          return res.data;
        }, $http.fallback);
      },
      getConversation: function (convId) {
        return $http.get(API_NAME.link + '/api/conversations/' + convId).then(function (res) {
          return res.data;
        }, $http.fallback);
      },
      addConversation: function (message) {
        return $http.post(API_NAME.link + '/api/conversations', message).then(function (res) {
          return res.data;
        }, $http.fallback);
      },
      updateConversation: function (message, convId) {
        return $http.put(API_NAME.link + '/api/conversations/' + convId, message).then(function (res) {
          return res.data;
        }, $http.fallback);
      },
      deleteConversation: function (convId) {
        return $http.delete(API_NAME.link + '/api/conversations/' + convId).then(function (res) {
          return res.data;
        }, $http.fallback);
      },
      addMessage: function (message) {
        return $http.post(API_NAME.link + '/api/messages', message).then(function (res) {
          return res.data;
        }, $http.fallback);
      }
    };
  });
