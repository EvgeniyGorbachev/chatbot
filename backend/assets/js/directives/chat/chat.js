angular.module('campaignsApp')
  .directive('chat', function() {
    return {
      templateUrl: '/assets/js/directives/chat/chat.html',
      link: function (scope, $element, $attr) {
        let websocketHost = location.hostname;
        let websocketPort = 8888;
        scope.websocketIsError = false;

        scope.isSend = false;

        scope.userConversation = [];
        scope.currentUser = {};

        scope.message = {
          "text": '',
          "user_id": '',
          "campaign_id": '',
          "direction": 1
        };


        scope.userList = [];

        let conversations = JSON.parse($attr.conversations);

        let socket = new WebSocket('ws://' + websocketHost + ':' + websocketPort);

        if (conversations.length > 0) {
          socket.onopen = function () {
            socket.send('{"target": "getUserList", "data": ' + JSON.stringify(conversations) + '}');
          };
        }

        socket.onmessage = function (message) {
          let res = JSON.parse(message.data);

          // console.log('get message: ', JSON.parse(message.data))

          if (res.target == 'userList') {
            scope.userList = res.data;
          }

          if (res.target == 'userConversation') {
            scope.userConversation = res.data;
          }

          if (res.target == 'userConversationUpdate') {
            scope.messageText = '';
            scope.isSend = false;
            scope.userConversation = res.data;
          }

          if (res.target == 'err') {
            console.error('Err: ', res.data);
            scope.websocketIsError = true;
          }

          scope.$digest();
        };

        socket.onerror = function (error) {
          console.log('WebSocket error: ', error);
          scope.websocketIsError = true;
          scope.$digest();
        };

        // // Send request to find new messages
        setInterval(function () {
          if (scope.currentUser.sender) {
            socket.send('{"target": "getUserConversation", "data": {"userId": "' + scope.currentUser.sender + '"}}');
          }
        }, 3000)

        // Send request to find new users
        // setInterval(function () {
        //   socket.send('{"target": "getUserList", "data": ' + JSON.stringify(conversations) + '}');
        // }, 3000)


        scope.getConversation = function(user) {
          isSend = false;
          messageText = '';

          scope.currentUser = user;
          socket.send('{"target": "getUserConversation", "data": {"userId": "' + scope.currentUser.sender + '"}}');
        }

        scope.sendMessage = function() {
          isSend = true;
          socket.send('{"target": "sendMessage", "data": {"user_id": "' + scope.currentUser.sender + '", "campaign_id":' + scope.currentUser.campaign_id + ', "text": "'+ scope.messageText +'", "direction": 1}}');
        }

      }
    };
  });