'use strict';

angular.module('myApp.review', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/review', {
    templateUrl: 'review/review.html',
    controller: 'ReviewCtrl',
    controllerAs: 'ReviewCtrl'
  });
}])

.controller('ReviewCtrl', ['$location', 'userService', function($location, userService) {
  var vm = this;

  vm.go = function ( path ) {
    $location.path( path );
  };

  vm.save = function () {
    console.log('save: ', userService.getUser())

    userService.sendData(userService.getUser())
      .then(function (res) {
        console.log('sussecc: ', res);
      }, function (res) {
        console.log('error: ', res);
      });
  };
}]);