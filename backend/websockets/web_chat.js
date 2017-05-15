const db = require('./../models/index.js')
const Smooch = require('smooch-core')
const crypto = require('crypto')

module.exports = function(webChat) {
  webChat.on('connection', function(socket){

    // Init user
    socket.on('initUser', function(msg){
      db.Campaigns.findOne({where: {id: msg.campaign_id}}).then(function (campaign) {

        const smooch = new Smooch({
          keyId : campaign.smooch_app_key_id,
          secret: campaign.smooch_app_secret,
          scope : 'app'
        });

        let id = crypto.randomBytes(20).toString('hex');

        smooch.appUsers.create(id + '@test.com', {
          givenName: 'Test name'
        }).then((response) => {

            console.log('CREATE USER: ', response);
          socket.emit('initUser', response)

        }).catch((err) => {
          // console.log(1111111, err)
          socket.emit('err', err.response.statusText)
        });
      }).catch((err) => {
        console.log(2222222222, err)
        socket.emit('err', err.response.statusText)

      });
    })

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
          role: 'appUser'
        }).then((response) => {
          // console.log('SEND MESSAGE: ', response);
          socket.emit('userSendMessage', response)

        }).catch((err) => {
          console.log(3333333, err)
          socket.emit('err', err.response.statusText)
        });

      }).catch((err) => {
        console.log(444444, err)
        socket.emit('err', err.response.statusText)
      });
    })

    // Get user messages
    socket.on('getMessages', function(msg){
      db.Campaigns.findOne({where: {id: msg.campaign_id}}).then(function (campaign) {

        const smooch = new Smooch({
          keyId : campaign.smooch_app_key_id,
          secret: campaign.smooch_app_secret,
          scope : 'app'
        });

        smooch.appUsers.getMessages(msg.user_id).then((response) => {
          // console.log('GET MESSAGE: ', response);
          socket.emit('getMessages', response)

        }).catch((err) => {
          console.log(55555555, err)
          socket.emit('err', err.response.statusText)
        });

      }).catch((err) => {
        console.log(666666, err)
        socket.emit('err', err.response.statusText)
      });
    })
  })
}