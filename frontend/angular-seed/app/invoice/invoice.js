'use strict';

angular.module('myApp.invoice', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/invoice/:data', {
      templateUrl: 'invoice/invoice.html',
      controller: 'InvoiceCtrl',
      controllerAs: 'InvoiceCtrl'
    });
  }])

  .controller('InvoiceCtrl', ['$location', 'userService', '$routeParams', function($location, userService, $routeParams) {
    var vm = this;

    vm.invoice = 'load';

    try {
      var invoice = JSON.parse(decodeURIComponent(escape(window.atob($routeParams.data))));
    } catch(e) {
      $location.path( '/order' );
      throw new Error('Wrong base64 decode');
    }

    var id = invoice.id;

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
