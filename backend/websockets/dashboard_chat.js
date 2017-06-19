const db = require('./../models/index.js')
const request = require('request')
const ss = require('socket.io-stream')
const stream = ss.createStream()
const fs = require('fs')
const path = require('path')
const gm = require('gm').subClass({imageMagick: true});
const helper = require('../lib/helper')

module.exports = function(dashboardChat, SMOOCH) {

  dashboardChat.on('connection', function(socket){

    ss(socket).on('file', function(stream, data) {

      let dir = path.resolve("./assets/img/user_files")
      let thumbnailDir = path.resolve("./assets/img/user_files/thumbnail")

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      if (!fs.existsSync(thumbnailDir)){
        fs.mkdirSync(thumbnailDir);
      }

      let filename =  data.userId + "_" + new Date().getTime() + "_"+ data.name
      let filenameFullPath = path.resolve( "./assets/img/user_files/" + filename)

      stream.pipe(fs.createWriteStream(filenameFullPath))

      stream.on('finish', function () {
          // Create thumbnail
          gm( "./assets/img/user_files/" + filename)
              .resize(200, 200)
              .write( "./assets/img/user_files/thumbnail/" + filename, function (err) {
                  if (err) console.log('Created thumbnail err: ', err);
              });
      });

      socket.emit('fileSaved', {"fileName": filename, "userId": data.userId, "campaign_id": data.campaign_id})
    });

    // Get user list
    socket.on('getUserList', function(msg){

      db.Conversations.findAll({where: { id: msg }, include: [{model: db.Campaigns}]})
          .then(function (conversations) {
            socket.emit('userList', conversations)
          })
          .catch(function(err) {
            console.log('Can not get user list: ', err)
          })
    });

    // Get new conversation by user id
    socket.on('getConversationBySmoochUserId', function(msg){

      db.Conversations.findOne({where: { sender: msg }, include: [{model: db.Campaigns}]})
          .then(function (conversation) {
            conversation.dataValues.smoochJwt = helper.getSmoochJwt(conversation.Campaign)
            socket.emit('addedNewConversation', conversation)
          })
          .catch(function(err) {
            console.log('Can not get conversation by smooch userId: ', err)
          })
    });

    // Get new conversation by user id
    socket.on('check_user_data', function(msg){

      db.Conversations.findAll({where: { sender: msg }, include: [{model: db.Campaigns}]})
          .then(function (conversations) {
            socket.emit('new_user_data', conversations)
          })
          .catch(function(err) {
            console.log('Can not check user data: ', err)
          })
    });

    // Set pause on conversation
    socket.on('pausedConversation', function(msg){
        db.Conversations.findOne({where: { id: msg.conversationId }})
            .then(function(conversations) {
                return conversations.update({
                    isPaused: msg.isPaused,
                    pausedTime: msg.isPaused ? new Date(): null,
                    pauseInitiator: msg.isPaused ? 'agent': null
                })
            })
            .catch(function(error) {
                console.log('Can not pause conversation: ', error);
            });
    });

    // Get user conversation
    socket.on('getUserConversation', function(msg){
        db.Campaigns.findOne({where: {id: msg.campaignId}})
            .then(function(campaign) {
                return SMOOCH.appUsers.getMessages(campaign.smooch_app_id, msg.smoochUserId)
            })
            .then(function(response) {
                socket.emit('userConversation', response)
            })
            .catch(function(error) {
                console.log(error);
                socket.emit('err', 'getUserConversation error')
            });
    });


    // Send message
    socket.on('sendMessage', function(msg){
        db.Campaigns.findOne({where: {id: msg.campaign_id}})
            .then(function(campaign) {
                let smoochOptions = {
                    type: 'text',
                    text: msg.text,
                    role: 'appMaker',
                    metadata: msg.smoochMessageMetadata || {}
                }
                return  SMOOCH.appUsers.sendMessage(campaign.smooch_app_id, msg.user_id, smoochOptions)
            })
            .then(function(response) {
                socket.emit('userConversationUpdate', response.message)
            })
            .catch(function(error) {
                console.log('Can not send message: ', error)
            });
    });

    // Link twilio
    socket.on('linkTwilio', function(msg){
      if (msg.phone) {
          db.Campaigns.findOne({where: {id: msg.campaign_id}})
              .then(function(campaign) {
                  if (campaign) {
                      return SMOOCH.appUsers.linkChannel(campaign.smooch_app_id, msg.user_id, {
                          type: 'twilio',
                          phoneNumber: msg.phone,
                          confirmation: {
                              type: 'immediate'
                          }
                      })
                  } else {
                      socket.emit('err', 'Wrong campaign id')
                      throw new Error('Can not find campaign')
                  }
              })
              .then(function(response) {
                  socket.emit('linkTwilioChannel', response)
              })
              .catch(function(error) {
                  console.log('Can not link to Twilio: ', error)
                  socket.emit('err', 'Can not link to chanel')
              });
      } else {
          socket.emit('err', 'No phone number')
      }
    });

      // Link facebook messenger
      socket.on('linkFacebook', function(msg){
          if (msg.phone) {
              db.Campaigns.findOne({where: {id: msg.campaign_id}})
                  .then(function(campaign) {
                      if (campaign) {
                          return SMOOCH.appUsers.linkChannel(campaign.smooch_app_id, msg.user_id, {
                              type: 'messenger',
                              phoneNumber: msg.phone,
                              confirmation: {
                              type: 'immediate'
                              }
                          })
                      } else {
                          socket.emit('err', 'Wrong campaign id')
                          throw new Error('Can not find campaign')
                      }
                  })
                  .then(function(response) {
                      socket.emit('linkTwilioChannel', response)
                  })
                  .catch(function(error) {
                      console.log('Can not link to Messanger: ', error)
                      socket.emit('err', 'Can not link to chanel')
                  });
          } else {
              socket.emit('err', 'No messenger number')
          }
      })
  });
}
