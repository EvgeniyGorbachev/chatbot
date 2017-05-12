const db = require('./../models/index.js')
const Smooch = require('smooch-core')
const request = require('request')

module.exports = function(dashboardChat) {

  dashboardChat.on('connection', function(socket){

    // Get user list
    socket.on('getUserList', function(msg){

      db.Conversations.findAll({where: { id: msg }, include: [{
        model: db.Campaigns
      }]}).then(function (conversations) {

        socket.emit('userList', conversations)

      }).catch(function(err) {
        console.log('err1: ', err)
      })
    });

    // Get user conversation
    socket.on('getUserConversation', function(msg){
      db.ConversationsHistory.findAll({where: {"user_id": msg.userId}, order: [['id', 'ASC']]}).then(function (history) {
        socket.emit('userConversation', history)
      })
    });

    // Send message
    socket.on('sendMessage', function(msg){
      db.Campaigns.findOne({where: {id: msg.campaign_id}}).then(function (campaign) {

        const smooch = new Smooch({
          keyId : campaign.smooch_app_key_id,
          secret: campaign.smooch_app_secret,
          scope : 'app'
        });

        smooch.appUsers.sendMessage(msg.user_id, {
          type: 'text',
          text: msg.text,
          role: 'appMaker'
        }).then((response) => {

          db.ConversationsHistory.create(msg).then(function(data) {

            db.ConversationsHistory.findAll({where: {"campaign_id": msg.campaign_id, "user_id": msg.user_id}, order: [['id', 'ASC']]}).then(function (history) {

              let dataToLambda = {
                "trigger":"delivery:success",
                "app":{"_id":campaign.smooch_app_id},
                "appUser":{"_id":msg.user_id},
                "destination":{"type":"api"},
                "messages":[{"text":"emulation"}],
                "timestamp":1493914595.09
              }

              // Hack for lambda
              request.post({url: process.env.CONFIRM_ORDER_CALLBACK, body: dataToLambda, json:true}, function(err,httpResponse,body){
                if (err) console.log('Get err from lambda: ', err)
                console.log('Get response from lambda: ', body)
              })

              socket.emit('userConversationUpdate', history)
            })

          }).catch(function(err) {
            socket.emit('err', err)
          })

        }).catch((err) => {
          socket.emit('err', err)
        });
      })
    });
  });
}