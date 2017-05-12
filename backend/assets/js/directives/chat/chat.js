angular.module('campaignsApp')
  .directive('chat', function() {
    return {
      scope: {},
      templateUrl: '/assets/js/directives/chat/chat.html',
      link: function (scope, $element, $attr) {

        let socket = io('/dashboardchat');

        scope.websocketIsError = false;
        scope.isSend = false;
        scope.smoochAppId = null;

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

          scope.smoochAppId = data[0].Campaign.smooch_app_id;

          // set init count new messages
          scope.userList.forEach(function(user) {
            user.newMessages = 0;
          })

          scope.$digest();
        });

        socket.on('userConversationUpdate', function (data) {
          scope.messageText = '';
          scope.isSend = false;
          scope.userConversation = data;
          scope.$digest();
        });

        socket.on('webhook', function (data) {
          if (data.type == 'new message') {
            // set count new message
            if (scope.smoochAppId == data.appId) {
              scope.userList.forEach(function(user) {
                if (data.userId == user.sender && user.id != scope.currentUser.id) {
                  user.newMessages++;
                }
              })
            }
          }
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
        // setInterval(function () {
        //   socket.emit('getUserList', conversations);
        // }, 3000);


        scope.getConversation = function(user) {
          scope.isSend = false;
          scope.messageText = '';

          // user see all new messages
          user.newMessages = 0;

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