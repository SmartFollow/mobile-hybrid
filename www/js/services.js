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
    
    function loadUserCredentials() {
        var token = window.localStorage.getItem($window.sessionStorage.token);
        if (token) {
            useCredentials(token);
        }
    }
  
    function storeUserCredentials(token) {
        window.localStorage.setItem($window.sessionStorage.token);
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
        window.localStorage.removeItem($window.sessionStorage.token);
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
    var notes = 
                [
                    {
                        "matter": "Math",
                        "notes":[
                            {
                                "id": 1,
                                "name": "Devoir maison",
                                "note": "18/20",
                                "comment": "Très bon travail.",
                                "matter": "Math"
                            },
                            {
                                "id": 2,
                                "name": "Controle 12/09",
                                "note": "11/20",
                                "comment": "Quelques notions à revoir.",
                                "matter": "Math"
                            }
                        ]
                    },
                    {
                        "matter": "Fançais",
                        "notes": [
                            {
                                "id": 3,
                                "name": "Dictée",
                                "note": "3/10",
                                "comment": "Grammaire désatreuse.",
                                "matter": "Francais"
                            }
                        ]
                    }
                ];
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
        getLesson: function(callback)
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
        getNotes: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var link = '';
            
            deferred.resolve(notes);
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            },
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getNote: function(matter, noteId) {
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].matter === matter) {
                    for (var j = 0; j < notes[i].notes.length; j++) {
                        if (notes[i].notes[j].id === parseInt(noteId)) {
                            return notes[i].notes[j];
                        }
                    }
                }
            }
            return null;
        }
    };
/*
        $http.get(link, {grant_type : 'password', client_id : '2', 
            client_secret : 'BjEebk7a3NP9nXOswW2Y5nJ04V7aRLGjxKYUEV3C', 
            username : name, password : pw,
            scope : ''})
        .success(function(data, status, headers,config){
            console.log('data success');
            deferred.resolve(data);
        })
        .error(function(data, status, headers,config){
            console.log('data error');
            deferred.reject('Wrong credentials.');
        });
        promise.success = function(fn) {
            promise.then(fn);
            return data;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
        }
    };*/
}])

.service('ScheduleService', function($q) {  
    var schedule = 
    [
        {
            "matter": "Anglais",
            "name": "Prétérit Simple",
            "start": "8h",
            "end": "9h",
            "duration": "1h"
        },
        {
            "matter": "Math",
            "name": "Nombres combinatoire",
            "start": "10h",
            "end": "12h",
            "duration": "2h"
        },
        {
            "matter": "Physique",
            "name": "Densité",
            "start": "14h",
            "end": "16h",
            "duration": "2h"
        },
        {
            "matter": "Sport",
            "name": "Basket",
            "start": "16h30",
            "end": "17h",
            "duration": "0h30"
        }
    ];
    return {
        get: function() {  
            var deferred = $q.defer();
            var promise = deferred.promise;
            var link = '';
            
            deferred.resolve(schedule);
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            },
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    }
})
            

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
