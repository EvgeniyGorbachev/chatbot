const url = require('url')
const WebSocket = require('ws')
const db = require('./../models/index.js')
const Smooch = require('smooch-core')
const crypto = require('crypto')

/**
 * WebSocket.
 */
const wss = new WebSocket.Server({ port: 8787 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let mes = JSON.parse(message)

    // Init user
    if (mes.target == 'initUser') {
      db.Campaigns.findOne({where: {id: mes.data.campaign_id}}).then(function (campaign) {

        const smooch = new Smooch({
          keyId : campaign.smooch_app_key_id,
          secret: campaign.smooch_app_secret,
          scope : 'app'
        });

        let id = crypto.randomBytes(20).toString('hex');
        smooch.appUsers.create(id + '@test.com', {
          givenName: 'Test name'
        }).then((response) => {
          let data = {
            "target": "initUser",
            "data": response
          };
          ws.send(JSON.stringify(data));
        }).catch((err) => {
          console.log(1111111, err)
          let data = {
            "target": "err",
            "data": err
          };
          ws.send(JSON.stringify(data));
        });
      }).catch((err) => {
        let data = {
          "target": "err",
          "data": err
        };
        console.log(2222222222, err)
        ws.send(JSON.stringify(data));
      });
    }

    // Send message
    if (mes.target == 'sendMessage') {

      db.Campaigns.findOne({where: {id: mes.data.campaign_id}}).then(function (campaign) {

        const smooch = new Smooch({
          keyId : campaign.smooch_app_key_id,
          secret: campaign.smooch_app_secret,
          scope : 'app'
        });

        smooch.appUsers.sendMessage(mes.data.user_id, {
          type: 'text',
          text: mes.data.text,
          role: 'appUser'
        }).then((response) => {

          let data = {
            "target": "userSendMessage",
            "data": response
          };
          ws.send(JSON.stringify(data));

        }).catch((err) => {
          let data = {
            "target": "err",
            "data": err
          };
          console.log(3333333, err)
          ws.send(JSON.stringify(data));
        });

      }).catch((err) => {
        let data = {
          "target": "err",
          "data": err
        };
        console.log(444444, err)
        ws.send(JSON.stringify(data));
      });
    }

    // Get user messages
    if (mes.target == 'getMessages') {

      db.Campaigns.findOne({where: {id: mes.data.campaign_id}}).then(function (campaign) {

        const smooch = new Smooch({
          keyId : campaign.smooch_app_key_id,
          secret: campaign.smooch_app_secret,
          scope : 'app'
        });

        smooch.appUsers.getMessages(mes.data.user_id).then((response) => {

          let data = {
            "target": "getMessages",
            "data": response
          };
          ws.send(JSON.stringify(data));

        }).catch((err) => {
          let data = {
            "target": "err",
            "data": err
          };
          console.log(55555555, err)
          ws.send(JSON.stringify(data));
        });

      }).catch((err) => {
        let data = {
          "target": "err",
          "data": err
        };
        console.log(666666, err)
        ws.send(JSON.stringify(data));
      });
    }

  });
});