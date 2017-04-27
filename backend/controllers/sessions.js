const db = require('../models/index.js')

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
                session : conversations
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