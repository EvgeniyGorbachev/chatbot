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
      console.log(111111,req.body.appUser,  req.body.appUser['_id'])
      db.Conversations.findOne({where: {sender: req.body.appUser['_id']}}).then(function (campaign) {
        console.log(2222222,campaign)
        if (campaign && !campaign.userId) {
          campaign.userId = 1;
          console.log(333333,campaign)
          campaign.update(campaign).then(function() {
            console.log('Webhookkkkkk assign user to conversation');
          }).catch((err) => {
            console.log('Webhookkkkkk ERRRRRR assign user to conversation: ', err);
          });
        }
      }).catch((err) => {
        console.log('Webhookkkkkk ERRRRRR find user: ', err);
      });
    }


    res.sendStatus(201);
  }
};