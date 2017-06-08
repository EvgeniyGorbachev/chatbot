const db = require('../models/index.js');


/**
 * GET /dashboard/:id
 * Get dashboard by campaign id.
 */
exports.getDashboardById = (req, res) => {
  let id = req.params.id || false
  db.Payments.findAll({ where: {campaign_id: id} }).then(function (users) {
    db.Conversations.findAll({ where: {campaign_id: id} , include: [{
      model: db.Users
    }]}).then(function (conversations) {
      db.Campaigns.findOne({where: {id: id}}).then(function (campaign) {
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

      }).catch(function(err) {
        res.redirect('/campaigns')
      })
    })
  })
};