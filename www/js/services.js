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
                url: 'http://api.dev.smartfollow.lan/api/users/profile'
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
                url: 'http://api.dev.smartfollow.lan/api/lessons'
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
                url: 'http://api.dev.smartfollow.lan/api/evaluations'
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
                url: 'http://api.dev.smartfollow.lan/api/lessons/' + lessonId
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
                url: 'http://api.dev.smartfollow.lan/api/lessons/1/homeworks'
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
                url: 'http://api.dev.smartfollow.lan/api/lessons/' + lessonId + '/documents/' + docId
            }).then(function(res){
                me.currentUser = res.data;
                callback(me.currentUser);
            });
        },
    };
}])

         
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
