'use strict';

angular.module('myApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main/:userData', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl',
    controllerAs: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$location', 'userService', '$routeParams', function($location, userService, $routeParams) {
  var vm = this;
  vm.isLearnMore = false;
  vm.user = userService.getUser();

  try {
    var userData = JSON.parse(decodeURIComponent(escape(window.atob($routeParams.userData))));
  } catch(e) {
    $location.path( '/order' );
    throw new Error('Wrong base64 decode');
  }

  var userName = userData.userName;
  var nameArr = userName.split(' ');

  vm.user.campaign_id = userData.campaign_id;
  vm.user.appUserId = userData.appUserId;
  vm.user.appId = userData.appId;
  vm.user.phone = userData.phone;
  vm.user.billing.email = userData.email;
  vm.user.shipping.email = userData.email;
  vm.user.email = userData.email;
  vm.user.userName = userData.userName;
  vm.user.shipping.firstName = nameArr[0];
  vm.user.shipping.lastName = nameArr[1];
  vm.user.billing.firstName = nameArr[0];
  vm.user.billing.lastName = nameArr[1];
  vm.user.shipping.addressFirst = userData.address;
  vm.user.billing.addressFirst = userData.address;

  userService.saveUser(vm.user);

  $location.path( '/order' );

  vm.go = function ( path ) {
    $location.path( path );
  };
}]);
