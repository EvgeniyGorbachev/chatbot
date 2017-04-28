const db     = require('../models/index.js')
const Smooch = require('smooch-core')
let jwt      = require('jsonwebtoken');

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
            campaign: campaign,
            jwt     : jwt.sign({scope: 'app'}, campaign.smooch_app_secret)
        })

    }).catch(function (err)
    {
        res.redirect('/campaigns')
    })
};