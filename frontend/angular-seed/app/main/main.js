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
  vm.user.email = $location.search().email;
  vm.user.userName = $location.search().userName;

  userService.saveUser(vm.user);

  vm.go = function ( path ) {
    $location.path( path );
  };
}]);
