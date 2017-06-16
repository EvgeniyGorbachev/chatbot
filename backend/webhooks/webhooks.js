const request = require('request')
const db = require('../models/index.js')

/**
 * POST /webhook/web-chat
 * Webhook for web chat (Smooch integration)
 */
exports.webChat = (req, res) => {
  console.log('Get webhookkkkkk: ', req.body);

  if (req.body.trigger == 'message:appMaker') {
    req.webChatSocket.emit('webhook', {type: 'new message', userId: req.body.appUser['_id'], appId: req.body.app['_id'], messages: req.body.messages});

    // Hack for lambda
    if (req.body.appUser['_id'] && req.body.app['_id']) {
      let dataToLambda = {
        "trigger":"delivery:success",
        "app":{"_id":req.body.app['_id']},
        "appUser":{"_id":req.body.appUser['_id']},
        "destination":{"type":"api"},
        "messages":[{"text":"emulation"}],
        "timestamp":1493914595.09
      }

      request.post({url: process.env.CONFIRM_ORDER_CALLBACK, body: dataToLambda, json:true}, function(err,httpResponse,body){
        if (err) console.log('Get err from lambda: ', err)
        console.log('Get response from lambda: ', body)
      })
    }

    // Attach manager to conversation
    if (req.body.appUser && req.body.appUser['_id']) {
        console.log('attachConversationToAgent  by appMaker')
        attachConversationToAgent(req)
    }

    console.log(req.body);
    req.dashboardChatSocket.emit('webhook', {type: 'new message from bot', userId: req.body.appUser['_id'], appId: req.body.app['_id'], messages: req.body.messages});
  }

  if (req.body.trigger == 'message:appUser') {
      console.log(req.body);
      req.dashboardChatSocket.emit('webhook', {type: 'new message from user', userId: req.body.appUser['_id'], appId: req.body.app['_id'], messages: req.body.messages});
      console.log('attachConversationToAgent  by appUser')
      attachConversationToAgent(req)
  }

  res.sendStatus(201);

  function attachConversationToAgent(req) {
      console.log('attachConversationToAgent  111111111')
    if (req.body.appUser['_id'] && req.body.app['_id']) {
        console.log('attachConversationToAgent  222222222')
        db.Conversations.findOne({where: {sender: req.body.appUser['_id']}}).then(function (conv) {
            console.log('attachConversationToAgent  3333333')
            if (conv && conv.userId == null) {
                console.log('attachConversationToAgent  44444444')
                // Attention HARDCODE
                conv.update({"userId": '1'}).then(function(c) {
                    console.log('Webhookkkkkk assign user to conversation', c);
                    console.log('attachConversationToAgent  555555')
                    req.dashboardChatSocket.emit('webhook', {type: 'new conversation added', userId: req.body.appUser['_id'], appId: req.body.app['_id'], agentId: c.userId});

                }).catch((err) => {
                    console.log('Webhookkkkkk ERRRRRR assign user to conversation: ', err);
                });
            }
        }).catch((err) => {
            console.log('Webhookkkkkk ERRRRRR find user: ', err);
        });
    }
  }

};
