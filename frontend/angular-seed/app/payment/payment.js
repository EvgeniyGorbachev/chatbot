'use strict';

angular.module('myApp.payment', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/payment', {
    templateUrl: 'payment/payment.html',
    controller: 'PaymentCtrl',
    controllerAs: 'PaymentCtrl'
  });
}])

.controller('PaymentCtrl', ['$location', 'userService', function($location, userService) {
  var vm = this;
  vm.user = userService.getUser();

  vm.go = function ( path ) {
    userService.saveUser(vm.user);
    $location.path( path );
  };
}]);