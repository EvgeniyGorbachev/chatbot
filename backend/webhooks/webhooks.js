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


    res.sendStatus(201);
  }

  // User begin conversation
  if (req.body.trigger == 'message:appUser') {

    if (req.body.appUser && req.body.appUser['_id']) {
      db.Conversations.findOne({where: {sender: req.body.appUser['_id']}}).then(function (campaign) {
        if (campaign && !campaign.userId) {
          campaign.userId = 1;
          campaign.update(campaign).then(function() {
            console.log('Webhookkkkkk assign user to conversation');
          })
        }
      })
    }
    res.sendStatus(201);
  }
};