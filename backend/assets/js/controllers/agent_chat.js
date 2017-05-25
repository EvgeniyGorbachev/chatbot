'use strict';

angular.module('campaignsApp.agentChat', [])
  .controller('AgentChatController', function($scope, $timeout) {
    let vm = this;

    let socket = io('/dashboardchat');

    vm.websocketIsError = false;
    vm.isSend = false;
    vm.isDownloadingFile = false;
    vm.smoochAppId = null;
    vm.fileErrorText = null;

    vm.userConversation = [];
    vm.userList = [];
    vm.currentUser = {};

    vm.message = {
      "text": '',
      "user_id": '',
      "campaign_id": '',
      "direction": 1
    };

    $(function() {

        $("#messageEditor").emojioneArea({
            pickerPosition  : "top",
            filtersPosition : "bottom",
            tones           : false,
            autocomplete    : false,
            inline          : true,
            hidePickerOnBlur: false,
            shortnames      : true
        });

      // Download file
      $('#file').change(function(e) {
        vm.isDownloadingFile = true;
        let file = e.target.files[0];
        let stream = ss.createStream();

        if (vm.isValidFile(file)) {
          // Upload a file to the server.
          ss(socket).emit('file', stream, {"name": file.name, "userId": vm.currentUser.sender, "campaign_id": vm.currentUser.campaign_id,});
          ss.createBlobReadStream(file).pipe(stream);
        }
      });
    });

    socket.on('new_user_data', function (data) {
      // Update username
      vm.conversations.forEach(function(conv, i) {
        data.forEach(function(newConv, n) {
          if (conv.sender == newConv.sender) {
            vm.conversations[i].username = data[n].username;
          }
        });
      });
      $scope.$digest();
    });

    socket.on('userConversation', function (data) {
      vm.userConversation = data;
      $scope.$digest();
    });

    socket.on('addedNewConversation', function (data) {

      let isDuplicate = false;

      vm.conversations.forEach(function(conv) {
        if (conv.sender == data.sender) {
          isDuplicate = true;
        }
      });

      if (!isDuplicate) {
        data.newMessages = 1;
        vm.conversations.push(data);
        $scope.$digest();
      }

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

    socket.on('fileSaved', function (data) {
      let link = '/assets/img/user_files/' + data.fileName
      let text = '<a data-file-name= "'+ data.fileName +'" href="' + link +'" download>Download link</a>'
      socket.emit('sendMessage', {"user_id": data.userId, "campaign_id": data.campaign_id, "text": text, "direction": 1});
      vm.isDownloadingFile = false;
    });

    // Check user data
    setInterval(function () {
      let ids = [];
      vm.conversations.forEach(function(conv, i) {
        if (conv.username == null) {
          ids.push(conv.sender);
        }
      })

      socket.emit('check_user_data', ids);
    }, 4000);


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
      console.log( vm.messageText);
      socket.emit('sendMessage', {"user_id": vm.currentUser.sender, "campaign_id": vm.currentUser.campaign_id, "text": vm.messageText, "direction": 1});
    };

    vm.isValidFile = function(file) {

      if (!file) return false;

      if (file.size > 10000000) {
        vm.fileErrorText = 'File size can not be greater than 10Mb';
        return false;
      }

      let availableExtention = {
        "doc" : true,
        "jpeg": true,
        "pdf" : true,
        "png" : true,
        "xls" : true,
        "xlsx": true
      };

      let fileExtenstion = file.name.split('.').pop();

      if (!availableExtention[fileExtenstion]) {
        vm.fileErrorText = 'Only files with extension are allowed: .png, .jpeg, .pdf, .doc, .xlsx, .xls';
        return false;
      }

      $scope.$digest();
      return true;
    };

  }).filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);
