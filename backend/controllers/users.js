const db         = require('../models/index.js');
const SmoochCore = require('smooch-core');
const request    = require('request');

/**
 * GET /users
 * List of users.
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
 * GET /users/:id
 * Get user by id.
 */
exports.getUserById = (req, res) =>
{

    if (req.app.locals.user.Role.name != 'admin') {
        res.redirect('/campaigns');
    }

    let id = req.params.id;

    db.Users.findOne({where: {id: id}}).then(function (user)
    {
        let data = JSON.stringify(user);

        db.Campaigns.all({order: 'id DESC'}).then(function (campaigns)
        {

            db.UsersHasCampaign.findAll({where: {user_id: id}}).then(function(user_has_campaigns){
                let campaignList = [];
                for(var i in user_has_campaigns){
                    campaignList[user_has_campaigns[i].campaign_id] = user_has_campaigns[i].campaign_id;
                }
                res.render('users/edit', {
                    user     : data,
                    campaigns: campaigns,
                    user_has_campaign: campaignList
                })
            });


        });
    }).catch(function (err)
    {
        db.Campaigns.all({order: 'id DESC'}).then(function (campaigns)
        {
            res.render('users/edit',{
                user     : {},
                campaigns: campaigns,
                user_has_campaign: []
            });
        });
    })
};


/**
 * POST /users/:id
 * Update useer by id.
 */
exports.updateUserById = (req, res) => {
    let user = req.body;

    //if update
    if (req.params.id && ("new" != req.params.id)) {
        db.Users.findOne({ where: {id: req.params.id} }).then(function(item) {
            item.update(user).then(function() {
                let data = JSON.stringify(user);

                if(user.userRole == 2){
                    db.UsersHasCampaign.destroy({
                        where:{
                            user_id: req.params.id
                        }
                    });
                    if(req.body.user_has_campaign){
                        for(let i in req.body.user_has_campaign){
                            let obj = {
                                user_id: req.params.id,
                                campaign_id: req.body.user_has_campaign[i]
                            };

                            db.UsersHasCampaign.create(obj);
                        }
                    }
                }
                res.redirect('/users?updated=true');
            }).catch(function(err) {
                console.log(err)
                res.render('users/edit', {err: 'Update wrong'})
            })
        }).catch(function(err) {
            console.log(err)
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
        })
        //if create
    } else {

        // Save user
        db.Users.create(user).then(function(data) {

            console.log("data on creation", data);
            if(data.userRole == 2){
                db.UsersHasCampaign.destroy({
                    where:{
                        user_id: data.id
                    }
                });
                if(req.body.user_has_campaign){
                    for(let i in req.body.user_has_campaign){
                        let obj = {
                            user_id: data.id,
                            campaign_id: req.body.user_has_campaign[i]
                        };

                        db.UsersHasCampaign.create(obj);
                    }
                    res.redirect('/users?created=true');
                }else{
                    res.redirect('/users?created=true');
                }
            }else{
                res.redirect('/users?created=true');
            }

        }).catch(function(err) {

            return res.render('users/list', {err: 'Saved wrong'})
        })

    }
};