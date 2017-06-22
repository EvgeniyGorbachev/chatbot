const db = require('../models/index.js')

/**
 * GET /campaigns/:campaignid/sessions
 * Get sessions by id.
 */
exports.getSessionsById = (req, res, next) => {
    let campaignId = req.params.campaignid || false
    db.Campaigns.findOne({
            where: {
                id: campaignId
            }
        })
        .then(function(campaign) {
            res.render('sessions', {
                campaign: campaign
            })
        })
        .catch(function() {
            res.redirect('/campaigns')
            next()
        })
}

/**
 * GET /agent/:userid
 * Get sessions by user id.
 */
exports.getSessionsByUserId = (req, res, next) => {
    let userId = req.params.userid || false

    Promise.all([
            db.Users.findOne({
                where: {
                    id: userId
                },
                include: [{
                    model: db.Campaigns,
                }]
            }),
            db.Conversations.findAll({
                where: {
                    userId: userId
                },
                attributes: ['id', 'campaign_id']
            })
        ])
        .then(function(data) {
            let user = data[0]
            let conversations = data[1]

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
        })
        .catch(next);
}