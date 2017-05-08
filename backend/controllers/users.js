const db = require('../models/index.js')
const SmoochCore =  require('smooch-core')
const request = require('request')

/**
 * GET /campaigns
 * List of campaigns.
 */
exports.getUsers = (req, res) => {

  if (req.app.locals.user.Role.name != 'admin') {res.redirect('/campaigns');}

  db.Users.all({order: 'id DESC'}).then(function (users) {
      res.render('users', {
          usersList  : users,
          updated       : req.query.updated,
          deleted       : req.query.deleted,
          created       : req.query.created,
          err           : req.query.err
      })
  })
};
