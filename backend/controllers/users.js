const db = require('../models/index.js');
const request = require('request');

/**
 * GET /users
 * List of users.
 */
exports.getUsers = (req, res) => {

    db.Users.all({
        order: 'id DESC'
    }).then(function(users) {
        res.render('users/list', {
            usersList: users,
            updated: req.query.updated,
            deleted: req.query.deleted,
            created: req.query.created,
            err: req.query.err
        })
    })
};


/**
 * GET /users/:id
 * Get user by id.
 */
exports.getUserById = (req, res) => {

    let id = req.params.id;

    if (id != 'new') {
        db.Users.findOne({
                where: {
                    id: id
                }
            })
            .then(function(user) {
                let data = JSON.stringify(user);

                res.render('users/edit', {
                    user: data
                })

            })
            .catch(function(err) {
                res.redirect('/users');
            })
    } else {
        res.render('users/edit');
    }
};


/**
 * POST /users/:id
 * Update useer by id.
 */
exports.updateUserById = (req, res, next) => {
    let user = req.body;

    //if update
    if (req.params.id && ("new" != req.params.id)) {
        db.Users.findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(function(item) {
                return item.update(user)
            })
            .then(function() {
                res.redirect('/users?updated=true');
            })
            .catch(function(err) {
                res.render('users/list', {
                    err: 'Update wrong'
                })
                next()
            })

        //if create
    } else {

        // Save user
        db.Users.create(user)
            .then(function(data) {
                res.redirect('/users?created=true');
            })
            .catch(function(err) {
                return res.render('users/list', {
                    err: 'Saved wrong'
                })
            })
    }
};