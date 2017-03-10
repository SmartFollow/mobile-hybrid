angular.module('starter.constants', [])

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
 
.constant('USER_ROLES', {
  teacher: 'teacher_role',
  student: 'student_role',
  admin: 'admin_role'
})

.constant('API_NAME', { 
	link: 'http://api.dev.smartfollow.lan',
	secret: 'PS4RgoWprV8CCQTGTDfYq5eCfm0azNe1qva9oYMa',
	id: '2'
});