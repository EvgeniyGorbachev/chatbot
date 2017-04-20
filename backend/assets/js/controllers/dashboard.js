'use strict';

angular.module('campaignsApp.dashboard', [])
  .controller('DashboardListController', function() {

    let vm = this;
    vm.change = change;
    vm.isActive = {};

    function change(id) {
      let bool = vm.isActive[id] || false;
      $('#data').val(JSON.stringify({"id": id, "isActive": bool}));
      $('form').submit();
    }
  })
