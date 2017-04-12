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

  vm.user = userService.getUser();
  vm.buttonText = null;
  vm.isDataSend = false;

  vm.go = function ( path ) {
    $location.path( path );
  };

  vm.save = function () {
    vm.isDataSend = true;
    vm.buttonText = true;

    userService.sendData(userService.getUser())
      .then(function (res) {

        if (res.status == 200) {
          vm.user.isPaymentCompleted = true;
          userService.saveUser(vm.user);
        } else {
          vm.buttonText = false;
        }
      }, function (res) {
        vm.buttonText = false;
    });
  };
}]);
