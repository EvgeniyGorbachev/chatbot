'use strict';

angular.module('campaignsApp.sessionEdit', [])
  .controller('SessionsListController', function($scope, $timeout) {

    let vm = this;
    vm.isSend = false;
    vm.getConversation = getConversation;
    vm.sendMessage = sendMessage;
    vm.campaignId = location.pathname.split('/')[2];

    vm.websocketHost = location.hostname;
    vm.websocketPort = 8888;

    vm.userList = [];
    vm.userConversation = [];
    vm.currentUser = {};

    vm.message = {
      "text": '',
      "user_id": '',
      "campaign_id": '',
      "direction": 1
    };



    var socket = new WebSocket('ws://' + vm.websocketHost + ':' + vm.websocketPort);
    socket.onopen = function () {
      socket.send('{"target": "getCampaignUserList", "data": ' + vm.campaignId + '}');
    };

    socket.onmessage = function (message) {
      var res = JSON.parse(message.data);

      console.log('get message: ', JSON.parse(message.data))

      if (res.target == 'userList') {
        vm.userList = res.data;
      }

      if (res.target == 'userConversation') {
        vm.userConversation = res.data;
      }

      if (res.target == 'userConversationUpdate') {
        vm.messageText = '';
        vm.isSend = false;
        vm.userConversation = res.data;
      }

      if (res.target == 'err') {
        console.error('Err: ', res.data);
      }

      $scope.$digest();
    };

    socket.onerror = function (error) {
      console.log('WebSocket error: ' + error);
    };

    // Send request to find new messages
    setInterval(function () {
      if (vm.currentUser.sender && vm.campaignId) {
        socket.send('{"target": "getUserConversation", "data": {"userId": "' + vm.currentUser.sender + '", "campaignId":' + vm.campaignId + '}}');
      }
    }, 3000)

    // Send request to find new users
    setInterval(function () {
      if (vm.campaignId) {
        socket.send('{"target": "getCampaignUserList", "data": ' + vm.campaignId + '}');
      }
    }, 3000)

    function getConversation(user) {
      vm.isSend = false;
      vm.messageText = '';

      vm.currentUser = user;
      socket.send('{"target": "getUserConversation", "data": {"userId": "' + vm.currentUser.sender + '", "campaignId":' + vm.campaignId + '}}');
    }

    function sendMessage() {
      vm.isSend = true;
      socket.send('{"target": "sendMessage", "data": {"user_id": "' + vm.currentUser.sender + '", "campaign_id":' + vm.campaignId + ', "text": "'+ vm.messageText +'", "direction": 1}}');
    }

  });
