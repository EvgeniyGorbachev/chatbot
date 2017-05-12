angular.module('campaignsApp')
  .directive('chat', function() {
    return {
      scope: {},
      templateUrl: '/assets/js/directives/chat/chat.html',
      link: function (scope, $element, $attr) {

        let socket = io('/dashboardchat');

        scope.websocketIsError = false;
        scope.isSend = false;

        scope.userConversation = [];
        scope.userList = [];
        scope.currentUser = {};

        scope.message = {
          "text": '',
          "user_id": '',
          "campaign_id": '',
          "direction": 1
        };

        let conversations = JSON.parse($attr.conversations);

        if (conversations.length > 0) {
          socket.emit('getUserList', conversations);
        }

        socket.on('userConversation', function (data) {
          scope.userConversation = data;
          scope.$digest();
        });

        socket.on('userList', function (data) {
          scope.userList = data;
          scope.$digest();
        });

        socket.on('userConversationUpdate', function (data) {
          scope.messageText = '';
          scope.isSend = false;
          scope.userConversation = data;
          scope.$digest();
        });

        socket.on('err', function (data) {
          console.log('WebSocket error: ', data);
          scope.websocketIsError = true;
          scope.$digest();
        });

        // // Send request to find new messages
        // setInterval(function () {
        //   if (scope.currentUser.sender) {
        //     socket.send('{"target": "getUserConversation", "data": {"userId": "' + scope.currentUser.sender + '"}}');
        //   }
        // }, 3000)

        // Send request to find new users
        setInterval(function () {
          socket.emit('getUserList', conversations);
        }, 3000);


        scope.getConversation = function(user) {
          scope.isSend = false;
          scope.messageText = '';

          scope.currentUser = user;
          socket.emit('getUserConversation', {"userId": scope.currentUser.sender});
        };

        scope.sendMessage = function() {
          scope.isSend = true;
          socket.emit('sendMessage', {"user_id": scope.currentUser.sender, "campaign_id": scope.currentUser.campaign_id, "text": scope.messageText, "direction": 1});
        };

      }
    };
  });