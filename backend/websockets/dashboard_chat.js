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

    // Get new conversation by user id
    socket.on('getConversationByUserId', function(msg){

      db.Conversations.findAll({where: { sender: id }, include: [{
        model: db.Campaigns
      }]}).then(function (conversations) {

        socket.emit('addedNewConversation', conversations)

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

              socket.emit('userConversationUpdate', history)

            })

          }).catch(function(err) {
            socket.emit('err', err.response.statusText)
          })

        }).catch((err) => {
          socket.emit('err', err.response.statusText)
        });
      })
    });
  });
}