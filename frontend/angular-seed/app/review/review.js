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
  vm.buttonText = ' Complete Payment';

  vm.go = function ( path ) {
    $location.path( path );
  };

  vm.save = function () {

    userService.sendData(userService.getUser())
      .then(function (res) {

        if (res.status == 200) {
          vm.buttonText = ' Complete successfully!';
          vm.user.isPaymentCompleted = true;
          userService.saveUser(vm.user);
        } else {
          vm.buttonText = ' Payment error';
        }
      }, function (res) {
        vm.buttonText = ' Payment error';
      });
  };
}]);
