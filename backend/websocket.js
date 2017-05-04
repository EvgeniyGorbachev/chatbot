const url = require('url')
const WebSocket = require('ws')
const db = require('./models/index.js')
const Smooch = require('smooch-core')

/**
 * WebSocket.
 */
const wss = new WebSocket.Server({ port: 8888 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let mes = JSON.parse(message)

    // Get user list
    if (mes.target == 'getUserList') {
      let fieldName = ( mes.data.type == 'agent') ? "userId":"campaign_id";

      let obj = {};
      obj[fieldName] = mes.data.value;

      db.Conversations.findAll({where: obj, include: [{
        model: db.Campaigns
      }]}).then(function (conversations) {
        let data = {
          "target": "userList",
          "data": conversations
        }
        ws.send(JSON.stringify(data));
      }).catch(function(err) {
        console.log('err1: ', err)
      })
    }

    // Get user conversation
    if (mes.target == 'getUserConversation') {
      db.ConversationsHistory.findAll({where: {"campaign_id": mes.data.campaignId, "user_id": mes.data.userId}, order: [['id', 'ASC']]}).then(function (history) {
        let data = {
          "target": "userConversation",
          "data": history
        }
        ws.send(JSON.stringify(data));
      })
    }

    // Save message
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
          role: 'appMaker'
        }).then((response) => {

          db.ConversationsHistory.create(mes.data).then(function(data) {

            db.ConversationsHistory.findAll({where: {"campaign_id": mes.data.campaign_id, "user_id": mes.data.user_id}, order: [['id', 'ASC']]}).then(function (history) {
              let data = {
                "target": "userConversationUpdate",
                "data": history
              }
              ws.send(JSON.stringify(data));
            })

          }).catch(function(err) {
            let data = {
              "target": "err",
              "data": err
            }
            ws.send(JSON.stringify(data));

          })


        }).catch((err) => {
          let data = {
            "target": "err",
            "data": err
          }
          ws.send(JSON.stringify(data));
        });
      })
    }

  });
});