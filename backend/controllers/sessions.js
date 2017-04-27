const db = require('../models/index.js')
const Smooch = require('smooch-core')

/**
 * GET /sessions/:id
 * Get sessions by id.
 */
exports.getSessionsById = (req, res) => {
  let userId = req.params.userid || false
  let campaignId = req.params.campaignid || false
// console.log(11111, userId, campaignId)
  db.Campaigns.findOne({where: {id: campaignId}}).then(function (campaign) {
    // console.log(2222222, campaign)
    if (campaign != null) {
      db.ConversationsHistory.findAll({where: {"campaign_id": campaignId, "user_id":userId}}).then(function (history) {
        console.log(3333333, history)
        if (history != null) {

          db.Conversations.findOne({where: {"campaign_id": campaignId, "sender":userId}}).then(function (conversations) {
            // console.log(3333333, conversations)
            if (conversations != null) {

              res.render('sessions', {
                campaign : campaign,
                history : history,
                session : conversations,
                userId : userId,
                campaignId : campaignId,
              })

            } else {
              res.redirect('/campaigns')
            }

          }).catch(function(err) {
            console.log(4444, err)
            res.redirect('/campaigns')
          })



        } else {
          res.redirect('/campaigns')
        }

      }).catch(function(err) {
        console.log(4444, err)
        res.redirect('/campaigns')
      })

    } else {
      res.redirect('/campaigns')
    }

  }).catch(function(err) {
    res.redirect('/campaigns')
  })

};

/**
 * POST /sessions
 * Save message
 */
exports.saveMessage = (req, res) => {
  let message = JSON.parse(req.body.jsonData)

  db.Campaigns.findOne({where: {id: message.campaign_id}}).then(function (campaign) {
    // console.log(999999999, campaign)

    const smooch = new Smooch({
      keyId : campaign.smooch_app_key_id,
      secret: campaign.smooch_app_secret,
      scope : 'app'
    });

    smooch.appUsers.sendMessage(message.user_id, {
      type: 'text',
      text: message.text,
      role: 'appMaker'
    }).then((response) => {

      // console.log(11111111, message)
      db.ConversationsHistory.create(message).then(function(data) {

        res.redirect('/sessions/'+message.user_id+'/'+message.campaign_id+'?created=true');

      }).catch(function(err) {
        // console.log(999999999, err)
        res.redirect('/campaigns')

      })


    }).catch((err) => {
      console.log('smoocheerrrrrrrrrrrrr', err)
      res.redirect('/campaigns')
    });
  })
};