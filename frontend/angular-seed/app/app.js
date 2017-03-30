'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.main',
  'myApp.order',
  'myApp.shipping',
  'myApp.payment',
  'myApp.review',
  'myApp.version'
]).
constant('config', {

  // set API URL //
  apiUrl: 'http://localhost:8181'
  // set API URL //

}).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('');
  // $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo: '/main'});
}]).factory('userService',['$http', '$q', 'config', function($http, $q, config) {
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
      $http.post(config.apiUrl + '/api/user', params).then(function (response) {
        deferred.resolve(response);
      }, function (response) {
        deferred.reject(response);
      });
      return deferred.promise;
    },

    userMock: {
      isPaymentCompleted: false,
      userName: '',
      phone: '',
      email: '',
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
