'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.main',
  'myApp.order',
  'myApp.shipping',
  'myApp.payment',
  'myApp.review',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/main'});
}]).factory('userService',['$http', '$q', function($http, $q) {
  return {
    user: false,

    getUser: function getInfo() {
      return (this.user)? this.user: this.userMock;
    },

    saveUser: function setData (user) {
      this.user = user;
    },

    sendData: function setData (params) {
      var deferred = $q.defer();
      $http.post('http://localhost:8181/api/user', params).then(function (response) {
        deferred.resolve(response);
      }, function (response) {
        deferred.reject(response);
      });
      return deferred.promise;
    },

    userMock: {
      userName: 'Mike',
      phone: '+1234567890',
      email: 'email@google.com',
      shipping: {
        firstName: '',
        lastName: '',
        email: '',
        addressFirst: '',
        addressSecond: '',
        city: '',
        state: '',
        zipCode: ''
      },
      billing: {
        firstName: '',
        lastName: '',
        email: '',
        addressFirst: '',
        addressSecond: '',
        city: '',
        state: '',
        zipCode: '',
        card: {
          number: '',
          expDate: '',
          cvv: ''
        }
      }
    }
  };
}]);
