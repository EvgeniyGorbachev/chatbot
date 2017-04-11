'use strict';

angular.module('myApp.invoice', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/invoice', {
      templateUrl: 'invoice/invoice.html',
      controller: 'InvoiceCtrl',
      controllerAs: 'InvoiceCtrl'
    });
  }])

  .controller('InvoiceCtrl', ['$location', 'userService', function($location, userService) {
    var vm = this;

    vm.invoice = 'load';

    var id = $location.search().id;

    if (!id) {
      vm.invoice = 'empty';
    } else {
      userService.getInvoice(id)
        .then(function (res) {

          if (res.status == 200 && res.data.msg != 'Wrong invoice ID') {
            vm.invoice = res.data;
          } else {
            vm.invoice = 'wrong';
          }
        }, function (res) {
          vm.invoice = 'wrong';
        });
    }
  }]);
