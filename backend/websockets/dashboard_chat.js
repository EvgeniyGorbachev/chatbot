const db = require('./../models/index.js')
const Smooch = require('smooch-core')
const request = require('request')
const ss = require('socket.io-stream')
const stream = ss.createStream()
const fs = require('fs')
const path = require('path')

module.exports = function(dashboardChat) {

  dashboardChat.on('connection', function(socket){

    ss(socket).on('file', function(stream, data) {

      let dir = path.resolve("./assets/img/user_files")

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      let filename =  data.userId + "_" + new Date().getTime() + "_"+ data.name
      let filenameFullPath = path.resolve( "./assets/img/user_files/" + filename)
      stream.pipe(fs.createWriteStream(filenameFullPath))

      socket.emit('fileSaved', {"fileName": filename, "userId": data.userId, "campaign_id": data.campaign_id})
    });

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

      db.Conversations.findOne({where: { sender: msg }, include: [{
        model: db.Campaigns
      }]}).then(function (conversations) {

        socket.emit('addedNewConversation', conversations)

      }).catch(function(err) {
        console.log('err1: ', err)
      })
    });

    // Get new conversation by user id
    socket.on('check_user_data', function(msg){

      db.Conversations.findAll({where: { sender: msg }, include: [{
        model: db.Campaigns
      }]}).then(function (conversations) {

        socket.emit('new_user_data', conversations)

      }).catch(function(err) {
        console.log('err1: ', err)
      })
    });

    // Set pause on conversation
    socket.on('pausedConversation', function(msg){

      db.Conversations.findOne({where: { id: msg.conversationId }}).then(function (conversations) {

        conversations.update({
          isPaused: msg.isPaused,
          pausedTime: msg.isPaused ? new Date(): null,
          pauseInitiator: msg.isPaused ? 'agent': null
        }).then(function () {

        }).catch(function (err) {
          console.log('err4444: ', err)
        })

      }).catch(function(err) {
        console.log('err22222: ', err)
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