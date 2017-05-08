const db         = require('../models/index.js');
const SmoochCore = require('smooch-core');
const request    = require('request');

/**
 * GET /campaigns
 * List of campaigns.
 */
exports.getUsers = (req, res) =>
{

    if (req.app.locals.user.Role.name != 'admin') {
        res.redirect('/campaigns');
    }

    db.Users.all({order: 'id DESC'}).then(function (users)
    {
        res.render('users/list', {
            usersList: users,
            updated  : req.query.updated,
            deleted  : req.query.deleted,
            created  : req.query.created,
            err      : req.query.err
        })
    })
};


/**
 * GET /campaigns/:id
 * Get campaign by id.
 */
exports.getUserById = (req, res) =>
{

    if (req.app.locals.user.Role.name != 'admin') {
        res.redirect('/campaigns');
    }

    let id = req.params.id;

    db.Users.findOne({where: {id: id}}).then(function (user)
    {
        console.log(user);
        let data = JSON.stringify(user);
        res.render('users/edit', {user: data})
    }).catch(function (err)
    {
        res.render('users/edit');
    })
};
