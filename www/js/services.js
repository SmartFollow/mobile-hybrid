angular.module('starter.services', [])

.service('AuthService', function($q, $http, USER_ROLES, API_NAME, $window) {
    var username = '';
    var role = '';
    var authToken;
    var link = API_NAME.link + '/oauth/token';
    var isAuth = false;
    var deferred = $q.defer();

    var login = function(name, pw) {
        return $http.post(link, {grant_type : 'password', client_id : API_NAME.id,
            client_secret : API_NAME.secret,
            username : name, password : pw,
            scope : ''})
        .success(function(data, status, headers,config){
            console.log('data success');
            storeUserCredentials(data.access_token);;
            $window.sessionStorage.token = data.access_token;
            deferred.resolve('Login success.');
        })
        .error(function(data, status, headers,config){
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

    var logout = function() {
        destroyUserCredentials();
    };
    var isAuthorized = function(authorizedRoles) {
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
        isAuthenticated: function() {return isAuthenticated;},
        username: function() {return username;},
        role: function() {return role;}
    };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS, $window) {
  return {
    request: function(config) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        return config;
      },
      response: function(response) {
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


.service('UserService', ['$http', '$q', 'API_NAME', function($http, $q, API_NAME) {
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
        getLesson: function(lessonId, callback)
        {
            if(me.currentUser)
                callback(me.currentUser);
            $http({
                method: 'GET',
                url: API_NAME.link + '/api/lessons/' + lessonId
            }).then(function(res){
                me.currentUser = res.data;
                callback(me.currentUser);
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
        getNotifications: function(callback)
        {
          if(me.currentUser)
            callback(me.currentUser);
          $http({
            method: 'GET',
            url: API_NAME.link + '/api/notifications'
          }).then(function(res){
            me.currentUser = res.data;
            callback(me.currentUser);
          });
        },
        getNotification: function(notificationId, callback)
        {
          if(me.currentUser)
            callback(me.currentUser);
          $http({
            method: 'GET',
            url: API_NAME.link + '/api/notifications/' + notificationId
          }).then(function(res){
            me.currentUser = res.data;
            callback(me.currentUser);
          });
        }
    };
}])

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
    getConversation: function(convId)
    {
      return $http.get(API_NAME.link + '/api/conversations/' + convId).then(function (res) {
        return res.data;
      }, $http.fallback);
    },
    addConversation: function (message) {
      return $http.post(API_NAME.link + '/api/conversations', message).then(function(res) {
        return res.data;
      }, $http.fallback);
    },
    updateConversation: function (message, convId) {
      return $http.put(API_NAME.link + '/api/conversations/' + convId, message).then(function(res) {
        return res.data;
      }, $http.fallback);
    },
    deleteConversation: function (convId) {
      return $http.delete(API_NAME.link + '/api/conversations/' + convId).then(function(res) {
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
