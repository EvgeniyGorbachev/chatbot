'use strict';

angular.module('myApp.shipping', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shipping', {
    templateUrl: 'shipping/shipping.html',
    controller: 'ShippingCtrl',
    controllerAs: 'ShippingCtrl'
  });
}])

.controller('ShippingCtrl', ['$location', 'userService', function($location, userService) {
  var vm = this;
  vm.user = userService.getUser();

  vm.go = function ( path ) {
    userService.saveUser(vm.user);
    $location.path( path );
  };
}]);