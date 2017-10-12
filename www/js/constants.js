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
//
// .constant('API_NAME', {
//   link: 'http://api.eip.mmo-trick.org',
//   secret: 'IT1tAxoBLlzOJeE5gOoNqq2LOZws1EV5rfc7tZW2',
//   id: '2'
// });

.constant('API_NAME', {
  link: 'http://api.dev.smartfollow.lan',
  secret: '2Xok5KYdMEDPW5jZPkLcyNTAGEhEPxRCWbAzpL2g',
  id: '2'
});
