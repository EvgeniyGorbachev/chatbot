const db = require('./../models/index.js')
const Smooch = require('smooch-core')
const request = require('request')
const ss = require('socket.io-stream')
const stream = ss.createStream()
const fs = require('fs')
const path = require('path')
const gm = require('gm').subClass({imageMagick: true});
const helper = require('../lib/helper')

module.exports = function(dashboardChat) {

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

      db.Conversations.findAll({where: { id: msg }, include: [{
        model: db.Campaigns
      }]}).then(function (conversations) {

        socket.emit('userList', conversations)

      }).catch(function(err) {
        console.log('err1: ', err)
      })
    });

    // Get new conversation by user id
    socket.on('getConversationBySmoochUserId', function(msg){

      db.Conversations.findOne({where: { sender: msg }, include: [{
        model: db.Campaigns
      }]}).then(function (conversation) {
        conversation.dataValues.smoochJwt = helper.getSmoochJwt(conversation.Campaign)
        socket.emit('addedNewConversation', conversation)

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
        db.Campaigns.findOne({where: {id: msg.campaignId}}).then(function (campaign) {

            const smooch = new Smooch({
                keyId : campaign.smooch_app_key_id,
                secret: campaign.smooch_app_secret,
                scope : 'app'
            });

            smooch.appUsers.getMessages(msg.smoochUserId).then((response) => {
                socket.emit('userConversation', response)
            }).catch(function(err) {
                console.log(err)
                socket.emit('err', 'Can not get messages from Smooch')
            })
        }).catch(function(err) {
            console.log(err)
            socket.emit('err', 'Can not find Campaign')
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

          // Get user data
          smooch.appUsers.get(msg.user_id).then((res) => {
            console.log(111111, res)
            console.log(222222, res.appUser.clients)

              let dest = null
              // Check users channels
              if (res.appUser.clients[0]) {
                  dest = {
                      "integrationId": res.appUser.clients[0].id,
                      "integrationType": res.appUser.clients[0].platform
                  }
              }

              // Send messages
              smooch.appUsers.sendMessage(msg.user_id, {
                  type: 'text',
                  text: msg.text,
                  role: 'appMaker',
                  metadata: msg.smoochMessageMetadata || null,
                  destination: dest
              }).then((response) => {

                  socket.emit('userConversationUpdate', response.message)

              }).catch((err) => {
                  console.log(575757575577557, err)
                  socket.emit('err', 'Smooch can not send message')
              });
          }).catch((err) => {
              console.log(19191919, err)
              socket.emit('err', 'Smooch can not get user data')
          });

      })
    });

    // Link twilio
    socket.on('linkTwilio', function(msg){
      if (msg.phone) {
          db.Campaigns.findOne({where: {id: msg.campaign_id}}).then(function (campaign) {

              if (campaign) {
                  const smooch = new Smooch({
                      keyId: campaign.smooch_app_key_id,
                      secret: campaign.smooch_app_secret,
                      scope: 'app'
                  });

                  // Get user data
                  smooch.appUsers.get(msg.user_id).then((res) => {
                      let linkChannels = res.appUser.clients

                      // Delete all old channels
                      if (linkChannels.length > 0) {
                          linkChannels.forEach(function(channel) {
                              smooch.appUsers.unlinkChannel(msg.user_id, channel.platform).catch((err) => {
                                  console.log(909090909090, err)
                                  socket.emit('err', 'Smooch can not delete user channel')
                              });
                          })
                      }

                  })

                  smooch.appUsers.linkChannel(msg.user_id, {
                      type: 'twilio',
                      phoneNumber: msg.phone,
                      confirmation: {
                          type: 'prompt'
                      }
                  }).then((response) => {
                      // console.log('SEND MESSAGE: ', response);
                      socket.emit('linkTwilioChannel', response)

                  }).catch((err) => {
                      console.log(3131313131313, err)
                      socket.emit('err', 'Smooch can not link to chanel')
                  });
              } else {
                  socket.emit('err', 'Wrong campaign id')
              }
          }).catch((err) => {
              console.log(5151515151, err)
              socket.emit('err', 'Can not find campaign by id')
          });
      } else {
          socket.emit('err', 'No phone number')
      }
    });


      // Link facebook messenger
      socket.on('linkFacebook', function(msg){
          if (msg.phone) {
            db.Campaigns.findOne({where: {id: msg.campaign_id}}).then(function (campaign) {
                if (campaign) {
                  const smooch = new Smooch({
                      keyId : campaign.smooch_app_key_id,
                      secret: campaign.smooch_app_secret,
                      scope : 'app'
                  });

                    // Get user data
                    smooch.appUsers.get(msg.user_id).then((res) => {
                        let linkChannels = res.appUser.clients

                        // Delete all old channels
                        if (linkChannels.length > 0) {
                            linkChannels.forEach(function(channel) {
                                smooch.appUsers.unlinkChannel(msg.user_id, channel.platform).catch((err) => {
                                    console.log(909090909090, err)
                                    socket.emit('err', 'Smooch can not delete user channel')
                                });
                            })
                        }

                    })

                    smooch.appUsers.linkChannel(msg.user_id, {
                        type: 'messenger',
                        phoneNumber: msg.phone,
                        confirmation: {
                            type: 'prompt'
                        }
                    }).then((response) => {
                        // console.log('SEND MESSAGE: ', response);
                        socket.emit('linkFacebookChannel', true)

                    }).catch((err) => {
                        console.log(3131313131313, err)
                        socket.emit('err', 'Smooch can not link to chanel')
                    });

                } else {
                    socket.emit('err', 'Wrong campaign id')
                }
            }).catch((err) => {
                console.log(41414141414, err)
                socket.emit('err', 'Can not find campaign by id')
            });
          } else {
              socket.emit('err', 'No messenger number')
          }
      })
  });
}
