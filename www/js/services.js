angular.module('starter.services', [])

.service('AuthService', function($q, $http, USER_ROLES, API_NAME) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var role = '';
    var authToken;
    var link = API_NAME.link + '/oauth/token'; //'http://api.dev.smartfollow.org/oauth/token';
    var isAuth = false;
    var deferred = $q.defer();
    
    var login = function(name, pw) {
        return $http.post(link, {grant_type : 'password', client_id : API_NAME.id, 
            client_secret : API_NAME.secret, 
            username : name, password : pw,
            scope : ''})
        .success(function(data, status, headers,config){
            console.log('data success');
            storeUserCredentials(data.token + ".." + name)
            deferred.resolve('Login success.');
        })
        .error(function(data, status, headers,config){
            console.log('data error');
            deferred.reject('Wrong credentials.');
        });
    }
    
    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
            useCredentials(token);
        }
    }
  
    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }
    
    function useCredentials(token) {
        username = token.split("..")[1];
        //onsole.log(username);
        isAuth = true;
        authToken = token;

        // TODO Init Role 
        role = USER_ROLES.teacher;
        // Set the token as header for your requests!
        $http.defaults.headers.common['X-Auth-Token'] = token;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuth = false;
        $http.defaults.headers.common['X-Auth-Token'] = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
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
        isAuthorized: isAuthorized,
        isAuthenticated: function() {return isAuthenticated;},
        username: function() {return username;},
        role: function() {return role;}
    };
;
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        //401: AUTH_EVENTS.notAuthenticated,
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
                url: 'http://api.dev.smartfollow.lan/api/users/4',
                headers: {Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk0Nzk4MGY0NjY1MzY4OTExYmQ3MjE2YzE0MDAwOTgzNjE2ZTlhY2YzZGM2ZWM0NGM3YTgxZjg4YzI3ZTE0YzhmZmZmNmMzNDFhODA5NzczIn0.eyJhdWQiOiIyIiwianRpIjoiOTQ3OTgwZjQ2NjUzNjg5MTFiZDcyMTZjMTQwMDA5ODM2MTZlOWFjZjNkYzZlYzQ0YzdhODFmODhjMjdlMTRjOGZmZmY2YzM0MWE4MDk3NzMiLCJpYXQiOjE0OTAyOTc4NzYsIm5iZiI6MTQ5MDI5Nzg3NiwiZXhwIjoxNTIxODMzODc2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.gWBVNU5u_K61tKSGd5Z1Pk9ko18agQvvPt7acFX5_SW-PTuUypr5dHmQglSJARc9Hh9NIY77OMp0DY51d_BmEdV3Swe0iJT0etHpLE-6Ba_gGwXEPQL7eLe9HaVBlARuwyvUvYxNSp0SYdoTbneA3mV4OhatoECr8pAHupXEvYKo88sTz-EBoGIEo7IbJvSy2G4sdQqVvCzOE2MEbwYeHy2K3QT1_KihH6nioqMM7AXag3sUh3uHd2-yd3Wyb-msjw559hOdSRXlmeHFgseK2da6uW5xLxX9ENeEFpVvfy3t78TzaZ7_zrAeNJIFzJJ-S13WmEqTprc6e8NJWBQKO5gHvM4n1OV4wrAedMbOq_ZESpwWC_jxI-YGqmvvjlzzX8qzs0HFWFWlNM_NOYbS4PqDe42ZBQeVHKf3DG310vngM04mt50PZfHNdpLHByecHxjYQZbt-1CQUXw1Ow3sap06MXsPB8n2nI1ZqFGPCzJE5Dq2_hWIazUiqsCW7Xb2wjxdjOQ0Hq-FNQF8M600QzqPx8m5qsLY5hIRRmYwAw0NNTH7C2RLbRYNqtqax-QwkDzZOKUWgKPckbkr3QqUoeylLhjrwv_gbaM3V1azpehFBHmCi_oSyew9bAbpIOL18bUMG-bsWmaqksH5siUXDVAow8aMzXqMu9p3vnv8xxI"}

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
                url: 'http://api.dev.smartfollow.lan/api/lessons',
                headers: {Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk0Nzk4MGY0NjY1MzY4OTExYmQ3MjE2YzE0MDAwOTgzNjE2ZTlhY2YzZGM2ZWM0NGM3YTgxZjg4YzI3ZTE0YzhmZmZmNmMzNDFhODA5NzczIn0.eyJhdWQiOiIyIiwianRpIjoiOTQ3OTgwZjQ2NjUzNjg5MTFiZDcyMTZjMTQwMDA5ODM2MTZlOWFjZjNkYzZlYzQ0YzdhODFmODhjMjdlMTRjOGZmZmY2YzM0MWE4MDk3NzMiLCJpYXQiOjE0OTAyOTc4NzYsIm5iZiI6MTQ5MDI5Nzg3NiwiZXhwIjoxNTIxODMzODc2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.gWBVNU5u_K61tKSGd5Z1Pk9ko18agQvvPt7acFX5_SW-PTuUypr5dHmQglSJARc9Hh9NIY77OMp0DY51d_BmEdV3Swe0iJT0etHpLE-6Ba_gGwXEPQL7eLe9HaVBlARuwyvUvYxNSp0SYdoTbneA3mV4OhatoECr8pAHupXEvYKo88sTz-EBoGIEo7IbJvSy2G4sdQqVvCzOE2MEbwYeHy2K3QT1_KihH6nioqMM7AXag3sUh3uHd2-yd3Wyb-msjw559hOdSRXlmeHFgseK2da6uW5xLxX9ENeEFpVvfy3t78TzaZ7_zrAeNJIFzJJ-S13WmEqTprc6e8NJWBQKO5gHvM4n1OV4wrAedMbOq_ZESpwWC_jxI-YGqmvvjlzzX8qzs0HFWFWlNM_NOYbS4PqDe42ZBQeVHKf3DG310vngM04mt50PZfHNdpLHByecHxjYQZbt-1CQUXw1Ow3sap06MXsPB8n2nI1ZqFGPCzJE5Dq2_hWIazUiqsCW7Xb2wjxdjOQ0Hq-FNQF8M600QzqPx8m5qsLY5hIRRmYwAw0NNTH7C2RLbRYNqtqax-QwkDzZOKUWgKPckbkr3QqUoeylLhjrwv_gbaM3V1azpehFBHmCi_oSyew9bAbpIOL18bUMG-bsWmaqksH5siUXDVAow8aMzXqMu9p3vnv8xxI"}

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
                url: 'http://api.dev.smartfollow.lan/api/lessons/1/homeworks',
                headers: {Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk0Nzk4MGY0NjY1MzY4OTExYmQ3MjE2YzE0MDAwOTgzNjE2ZTlhY2YzZGM2ZWM0NGM3YTgxZjg4YzI3ZTE0YzhmZmZmNmMzNDFhODA5NzczIn0.eyJhdWQiOiIyIiwianRpIjoiOTQ3OTgwZjQ2NjUzNjg5MTFiZDcyMTZjMTQwMDA5ODM2MTZlOWFjZjNkYzZlYzQ0YzdhODFmODhjMjdlMTRjOGZmZmY2YzM0MWE4MDk3NzMiLCJpYXQiOjE0OTAyOTc4NzYsIm5iZiI6MTQ5MDI5Nzg3NiwiZXhwIjoxNTIxODMzODc2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.gWBVNU5u_K61tKSGd5Z1Pk9ko18agQvvPt7acFX5_SW-PTuUypr5dHmQglSJARc9Hh9NIY77OMp0DY51d_BmEdV3Swe0iJT0etHpLE-6Ba_gGwXEPQL7eLe9HaVBlARuwyvUvYxNSp0SYdoTbneA3mV4OhatoECr8pAHupXEvYKo88sTz-EBoGIEo7IbJvSy2G4sdQqVvCzOE2MEbwYeHy2K3QT1_KihH6nioqMM7AXag3sUh3uHd2-yd3Wyb-msjw559hOdSRXlmeHFgseK2da6uW5xLxX9ENeEFpVvfy3t78TzaZ7_zrAeNJIFzJJ-S13WmEqTprc6e8NJWBQKO5gHvM4n1OV4wrAedMbOq_ZESpwWC_jxI-YGqmvvjlzzX8qzs0HFWFWlNM_NOYbS4PqDe42ZBQeVHKf3DG310vngM04mt50PZfHNdpLHByecHxjYQZbt-1CQUXw1Ow3sap06MXsPB8n2nI1ZqFGPCzJE5Dq2_hWIazUiqsCW7Xb2wjxdjOQ0Hq-FNQF8M600QzqPx8m5qsLY5hIRRmYwAw0NNTH7C2RLbRYNqtqax-QwkDzZOKUWgKPckbkr3QqUoeylLhjrwv_gbaM3V1azpehFBHmCi_oSyew9bAbpIOL18bUMG-bsWmaqksH5siUXDVAow8aMzXqMu9p3vnv8xxI"}

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
