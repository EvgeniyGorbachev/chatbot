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

  vm.buttonText = ' Complete Payment';

  vm.go = function ( path ) {
    $location.path( path );
  };

  vm.save = function () {
    console.log('save: ', userService.getUser())

    userService.sendData(userService.getUser())
      .then(function (res) {
        console.log('sussecc: ', res);

        if (res.status == 200) {
          vm.buttonText = ' Complete successfully!';
        } else {
          vm.buttonText = ' Payment error';
        }
      }, function (res) {
        vm.buttonText = ' Payment error';
        console.log('error: ', res);
      });
  };
}]);
