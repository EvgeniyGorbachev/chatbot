'use strict';

angular.module('myApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl',
    controllerAs: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$location', 'userService', function($location, userService) {
  var vm = this;

  vm.isLearnMore = false;
  vm.user = userService.getUser();

  vm.user.phone = $location.search().phone;
  vm.user.billing.email = $location.search().email;
  vm.user.shipping.email = $location.search().email;
  vm.user.email = $location.search().email;
  vm.user.userName = $location.search().userName;
  vm.user.shipping.firstName = $location.search().userName;
  vm.user.billing.firstName = $location.search().userName;
  vm.user.shipping.addressFirst = $location.search().address;
  vm.user.billing.addressFirst = $location.search().address;

  userService.saveUser(vm.user);

  $location.path( '/order' );

  vm.go = function ( path ) {
    $location.path( path );
  };
}]);
