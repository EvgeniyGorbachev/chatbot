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

    socket.on('new_user_data', function (data) {
      // update username
      vm.conversations.forEach(function(conv, i) {
        if (conv.sender == data.sender) {
          vm.conversations[i].username = data.username;
        }
      })
      $scope.$digest();
    });

    socket.on('userConversation', function (data) {
      vm.userConversation = data;
      $scope.$digest();
    });

    socket.on('addedNewConversation', function (data) {
      data.newMessages = 1;
      vm.conversations.push(data);
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
          if (data.userId == conv.sender && conv.sender != vm.currentUser.sender) {
            if (!conv.newMessages) {
              conv.newMessages = 0;
            }
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

      if (data.type == 'new conversation added') {
        console.log('webhook. Add new conversation to agent')
        socket.emit('getConversationByUserId', data.userId);
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

    // Check user data
    setInterval(function () {
      vm.conversations.forEach(function(conv, i) {
        if (conv.username == null) {
          socket.emit('check_user_data', conv.sender);
        }
      })
    }, 2000);


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
