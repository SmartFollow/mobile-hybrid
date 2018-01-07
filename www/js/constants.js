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
  link: 'http://api.dev.smartfollow.org',
  secret: 'fpWbyzAyOqQgugwnNZKIzxnbLuF5E5ZBK3Puf2IK',
  id: '2'
});
