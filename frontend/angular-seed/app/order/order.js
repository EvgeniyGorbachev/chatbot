'use strict';

angular.module('myApp.order', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/order', {
    templateUrl: 'order/order.html',
    controller: 'OrderCtrl',
    controllerAs: 'OrderCtrl'
  });
}])

.controller('OrderCtrl', ['$location', 'userService', function($location, userService) {
  var vm = this;
  vm.user = userService.getUser();
  vm.go = function ( path ) {
    $location.path( path );
  };
}]);