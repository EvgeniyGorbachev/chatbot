const request = require('request')
const db = require('../models/index.js')

/**
 * POST /webhook/web-chat
 * Webhook for web chat (Smooch integration)
 */
exports.webChat = (req, res) => {
  console.log('Get webhookkkkkk: ', req.body);

  if (req.body.trigger == 'message:appMaker') {

    // Hack for lambda
    if (req.body.appUser['_id'] && req.body.app['_id']) {

        db.Conversations.findOne({where: { sender: req.body.appUser['_id'] }, include: [{
            model: db.Campaigns
        }]}).then(function (conversation) {

            if (conversation.Campaign.isActive) {
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

        }).catch(function(err) {
            console.log('err1: ', err)
        })
    }

    // Attach manager to conversation
    if (req.body.appUser && req.body.appUser['_id']) {
        console.log('attachConversationToAgent  by appMaker')
        attachConversationToAgent(req)
    }

    console.log(req.body);

    req.dashboardChatSocket.emit('webhook', {type: 'new message from bot', userId: req.body.appUser['_id'], appId: req.body.app['_id'], messages: req.body.messages});
    req.webChatSocket.emit('webhook', {type: 'new message', userId: req.body.appUser['_id'], appId: req.body.app['_id'], messages: req.body.messages});
  }

  if (req.body.trigger == 'message:appUser') {
      console.log(req.body);
      req.dashboardChatSocket.emit('webhook', {type: 'new message from user', userId: req.body.appUser['_id'], appId: req.body.app['_id'], messages: req.body.messages});
      console.log('attachConversationToAgent  by appUser')

      // Attention HACK, 7 seconds we wait while the chat bot in a database creates record
      setTimeout(attachConversationToAgent, 7000, req);
  }

  res.sendStatus(201);

  function attachConversationToAgent(req) {
    if (req.body.appUser['_id'] && req.body.app['_id']) {
        db.Conversations.findOne({where: {sender: req.body.appUser['_id']}}).then(function (conv) {
            if (conv && conv.userId == null) {
                // Attention HARDCODE
                conv.update({"userId": '1'}).then(function(c) {
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
