const db     = require('../models/index.js')
const Smooch = require('smooch-core')

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
    db.Users.findOne({where: {id: userId}}).then(function (user)
    {
        console.log(11111, user)
        res.render('sessions', {
          user: user
        })

    }).catch(function (err)
    {
        res.redirect('/campaigns')
    })
}