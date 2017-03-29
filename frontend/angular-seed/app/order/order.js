'use strict';

angular.module('myApp.order', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/order', {
    templateUrl: 'order/order.html',
    controller: 'OrderCtrl',
    controllerAs: 'OrderCtrl'
  });
}])

.controller('OrderCtrl', ['$location', function($location) {
  var vm = this;

  vm.go = function ( path ) {
    $location.path( path );
  };
}]);