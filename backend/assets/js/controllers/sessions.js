'use strict';

angular.module('campaignsApp.sessionEdit', [])
  .controller('SessionsListController', function() {

    let vm = this;
    vm.sendMessage = sendMessage;
    vm.isFormSend = false;

    vm.message = {
      "text": '',
      "user_id": '',
      "campaign_id": '',
      "direction": 1
    };

    function sendMessage(event) {
      event.preventDefault();
      vm.isFormSend = true;
      console.log(11111, vm.message)
      if (!vm.form.$valid) {
        return false;
      }
      $('#data').val(JSON.stringify(vm.message));
      $('form').submit();
    }
  })
