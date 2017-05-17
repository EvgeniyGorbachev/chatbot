'use strict';

angular.module('campaignsApp.agentChat', [])
  .controller('AgentChatController', function($scope, $timeout) {
    let vm = this;

    let socket = io('/dashboardchat');

    vm.websocketIsError = false;
    vm.isSend = false;
    vm.smoochAppId = null;

    vm.userConversation = [];
    vm.userList = [];
    vm.currentUser = {};

    vm.message = {
      "text": '',
      "user_id": '',
      "campaign_id": '',
      "direction": 1
    };

    socket.on('userConversation', function (data) {
      vm.userConversation = data;
      $scope.$digest();
    });

    socket.on('userConversationUpdate', function (data) {
      vm.messageText = '';
      vm.isSend = false;
      vm.userConversation = data;
      $scope.$digest();
    });

    socket.on('webhook', function (data) {
      if (data.type == 'new message from user') {
        console.log('webhook. Get message from user')
        // set count new message
        vm.conversations.forEach(function(conv) {
          // If close window with webhook user, add counter
          console.log(111111, data, conv, vm.currentUser, (data.userId == conv.sender),( conv.id != vm.currentUser.sender));
          if (data.userId == conv.sender && conv.id != vm.currentUser.sender) {
            if (!conv.newMessages) {
              conv.newMessages = 0;
            }
            console.log('set conv.newMessages++');
            conv.newMessages++;
          }

          // If open window with webhook user, refresh messages
          if (data.userId == conv.sender && conv.id == vm.currentUser.sender) {
            socket.emit('getUserConversation', {"userId": vm.currentUser.sender});
          }
        })
      }

      if (data.type == 'new message from bot') {
        console.log('webhook. Get message from bot')
        // If open window with webhook user, refresh messages
        if (data.userId == vm.currentUser.sender) {
          socket.emit('getUserConversation', {"userId": vm.currentUser.sender});
        }
      }
      $scope.$digest();
    });

    socket.on('err', function (data) {
      console.log('WebSocket error: ', data);
      vm.websocketIsError = true;
      vm.isSend = false;
      $scope.$digest();
    });

    // Send request to find new messages
    // setInterval(function () {
    //   if (vm..currentUser.sender) {
    //     socket.emit('getUserConversation', {"userId": vm..currentUser.sender});
    //   }
    // }, 3000);
    //
    // // Send request to find new users
    // setInterval(function () {
    //   socket.emit('getUserList', conversations);
    // }, 3500);


    vm.getConversation = function(user) {
      vm.isSend = false;
      vm.messageText = '';

      // user see all new messages
      user.newMessages = 0;

      vm.currentUser = user;
      socket.emit('getUserConversation', {"userId": vm.currentUser.sender});
    };

    vm.sendMessage = function() {
      vm.isSend = true;
      socket.emit('sendMessage', {"user_id": vm.currentUser.sender, "campaign_id": vm.currentUser.campaign_id, "text": vm.messageText, "direction": 1});
    };

  });
