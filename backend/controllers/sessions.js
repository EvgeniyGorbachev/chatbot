const db     = require('../models/index.js')

/**
 * GET /sessions/:id
 * Get sessions by id.
 */
exports.getSessionsById = (req, res) =>
{
    let campaignId = req.params.campaignid || false
    db.Campaigns.findOne({where: {id: campaignId}}).then(function (campaign)
    {
        res.render('sessions', {
            campaign: campaign
        })

    }).catch(function (err)
    {
        res.redirect('/campaigns')
    })
}

/**
 * GET /agent/:userid
 * Get sessions by user id.
 */
exports.getSessionsByUserId = (req, res) =>
{
    let userId = req.params.userid || false
    db.Users.findOne({where: {id: userId}, include: [{
      model: db.Campaigns,
    }]}).then(function (user) {

      db.Conversations.findAll({where: { userId: userId }, attributes: ['id', 'campaign_id']}).then(function (conversations) {

        let obj = {}
        user.Campaigns.forEach(function(camp) {
          let ids = []
          conversations.forEach(function(conv) {
            if (camp.id == conv.campaign_id) {
              ids.push(conv.id)
            }
          })
          obj[camp.id] = ids
        })

        res.render('sessions', {
          user: user,
          campaigns: user.Campaigns,
          conversations: obj
        })
      }).catch(function(err) {
        console.log('err1: ', err)
      })

    }).catch(function (err) {

        // res.redirect('/campaigns')
    })
}