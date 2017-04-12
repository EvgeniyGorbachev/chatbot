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
  var userName = $location.search().userName;
  var nameArr = userName.split(' ');

  vm.user.phone = $location.search().phone;
  vm.user.billing.email = $location.search().email;
  vm.user.shipping.email = $location.search().email;
  vm.user.email = $location.search().email;
  vm.user.userName = $location.search().userName;
  vm.user.shipping.firstName = nameArr[0];
  vm.user.shipping.lastName = nameArr[1];
  vm.user.billing.firstName = nameArr[0];
  vm.user.billing.lastName = nameArr[1];
  vm.user.shipping.addressFirst = $location.search().address;
  vm.user.billing.addressFirst = $location.search().address;

  userService.saveUser(vm.user);

  $location.path( '/order' );

  vm.go = function ( path ) {
    $location.path( path );
  };
}]);
