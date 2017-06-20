const db = require('../models/index.js');


/**
 * GET /dashboard/:id
 * Get dashboard by campaign id.
 */
exports.getDashboardById = (req, res, next) => {
  let id = req.params.id || false

    Promise.all([
        db.Payments.findAll({ where: {campaign_id: id} }),
        db.Conversations.findAll({ where: {campaign_id: id} , include: [{model: db.Users}]}),
        db.Campaigns.findOne({where: {id: id}})
    ])
        .then(function(data) {
            let users = data[0]
            let conversations = data[1]
            let campaign = data[2]

            if (campaign != null) {
                res.render('dashboard', {
                    payments          : users,
                    conversations     : conversations,
                    conversationsCount: conversations.length,
                    paymentsCount     : users.length,
                    campaign          : campaign,
                    fileHostName      : process.env.FILE_HOST_NAME
                })
            } else {
                res.redirect('/campaigns')
            }

        })
        .catch(function() {
            res.redirect('/campaigns')
            next()
        })
};