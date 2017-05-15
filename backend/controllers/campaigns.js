const db = require('../models/index.js')
const SmoochCore =  require('smooch-core')
const request = require('request')

/**
 * GET /campaigns
 * List of campaigns.
 */
exports.getCampaigns = (req, res) => {
  db.Campaigns.all({order: 'id DESC'}).then(function (campaigns) {
      res.render('campaigns', {
          campaignList  : campaigns,
          updated       : req.query.updated,
          deleted       : req.query.deleted,
          created       : req.query.created,
          err           : req.query.err
      })
  })
};

/**
 * GET /campaigns/:id
 * Get campaign by id.
 */
exports.getCampaignById = (req, res) => {

  if (req.app.locals.user.Role.name != 'admin') {res.redirect('/campaigns');}

  let id = req.params.id

  db.Campaigns.findOne({ where: {id: id} }).then(function(campaign) {
    db.Users.all({order: 'id DESC'}).then(function (users) {
      db.UsersHasCampaign.findAll({where: {campaign_id: id}}).then(function(items){

        let usersId = []
        items.forEach(function(item) {
          usersId.push(item.user_id);
        });

        campaign.dataValues.users = usersId;
        let data = JSON.stringify(campaign)

        res.render('campaigns_edit', {
          campaign: data,
          users: users
        })
      })
    })
  }).catch(function(err) {
      res.render('campaigns_edit')
  })
};

/**
 * POST /campaigns/:id
 * Update campaign by id.
 */
exports.updateCampaignById = (req, res) => {
  let campaign = JSON.parse(req.body.jsonData)

  campaign.startDate = (new Date(campaign.startDate))
  campaign.endDate   = (new Date(campaign.endDate))

  //if update
  if (campaign.id) {
    db.Campaigns.findOne({ where: {id: campaign.id} }).then(function(item) {
      item.update(campaign).then(function() {

        if(campaign.users){
          db.UsersHasCampaign.destroy({
            where:{
              campaign_id: campaign.id
            }
          });

          for(let i in campaign.users){
            let obj = {
              user_id: campaign.users[i],
              campaign_id: campaign.id
            };

            db.UsersHasCampaign.create(obj);
          }

        } else {
          db.UsersHasCampaign.destroy({
            where:{
              campaign_id: campaign.id
            }
          });
        }

        res.redirect('/campaigns?updated=true');
      }).catch(function(err) {
        console.log(err)

        db.Users.all({order: 'id DESC'}).then(function (users) {
          res.render('campaigns_edit', {
            campaign: campaigns,
            users: users,
            err  : 'Update wrong'
          })
        })

      })
    }).catch(function(err) {
      console.log(err)
      db.Campaigns.all().then(function (campaigns)
      {
        db.Users.all({order: 'id DESC'}).then(function (users) {
          res.render('campaigns_edit', {
            campaign: campaigns,
            users: users,
            err  : 'Campaign not found'
          })
        })

      })
    })
    //if create
  } else {

    // Initializing Smooch Core with an account scoped key
    let smooch = new SmoochCore({
      keyId: process.env.SMOOCH_ACC_KEY,
      secret: process.env.SMOOCH_ACC_SECRET,
      scope: 'account'
    });

    // Create Smooch app
    smooch.apps.create({
      name: campaign.name
    }).then((response) => {

      campaign.smooch_app_token = response.app['appToken']
      campaign.smooch_app_id = response.app['_id']


      // Set the headers
      let headers = {
        'authorization'  : smooch.authHeaders.Authorization,
        'Content-Type': 'application/json'
      }

      // Configure the request Smooch API: HACK, because this don`t work:
      // smooch.apps.keys.create('59009f0befc9e41201a33ca9', {
      //   name: 'key',
      // }).then((response) => {
      //   console.log(response)
      // }).catch((err) => {
      //   console.log(err)
      // });
      let options = {
        url    : process.env.SMOOCH_API_URL + '/apps/' + campaign.smooch_app_id + '/keys',
        method : 'POST',
        headers: headers,
        form   : {"name": "key1"},
      }


      // Start the request to get smooch app key and secret
      request(options, function (error, response, body) {

        if (error) {
          console.log(333333, response)
          return res.render('campaigns_edit', {errSmooch: 'Smooch: Can not create key and secret for App'})
        }

        let smoochData = JSON.parse(body)
        campaign.smooch_app_key_id = smoochData.key['_id']
        campaign.smooch_app_secret = smoochData.key.secret

        // Smooch add twilio integration
        smooch.integrations.create(campaign.smooch_app_id, {
          type: 'twilio',
          accountSid: process.env.TWILIO_ACCOUNT_SID,
          authToken: process.env.TWILIO_AUTH_TOKEN,
          phoneNumberSid: campaign.twilio_phone_number_sid
        }).then((response) => {

          // Initializing Smooch Core with as an app scoped key
          let smoochApp = new SmoochCore({
            keyId: campaign.smooch_app_key_id,
            secret: campaign.smooch_app_secret,
            scope: 'app'
          });

          // Smooch add webhook
          smoochApp.webhooks.create({
            target: process.env.CONFIRM_ORDER_CALLBACK,
            triggers: '*'
          }).then((response) => {
            // Save campaign
            db.Campaigns.create(campaign).then(function(data) {

              if(campaign.users){
                for(let i in campaign.users){
                  let obj = {
                    user_id: campaign.users[i],
                    campaign_id: campaign.id
                  };

                  db.UsersHasCampaign.create(obj);
                }
              }

              res.redirect('/campaigns?created=true');
            }).catch(function(err) {
              console.log(5555,  err)
              return res.render('campaigns_edit', {err: 'Saved wrong'})
            })
          }).catch(function(err) {
            console.log(11111, err)
            return res.render('campaigns_edit', {errSmooch: 'Smooch: Can not add Webhook'})
          })
        }).catch(function(err) {
          console.log(22222, err)
          return res.render('campaigns_edit', {errSmooch: 'Smooch: Can not create Twilion integration'})
        })
      })
    }).catch(function(err) {
      console.log(44444,  err)
      return res.render('campaigns_edit', {errSmooch: 'Smooch: Can not create an App'})
    })
  }
};

/**
 * DELETE /campaigns/:id
 * Delete campaign by id.
 */
exports.deleteCampaignById = (req, res) => {
  let id = req.params.id

  db.Campaigns.findOne({where: {id: id}}).then(function (campaign) {
    campaign.destroy().then(function () {
      res.redirect('/campaigns?deleted=true');
    });

  }).catch(function (err) {
    res.redirect('/campaigns');
  })
};

/**
 * POST /campaigns/:id
 * Update campaign status.
 */
exports.updateCampaignStatus = (req, res) => {
  let campaign = JSON.parse(req.body.jsonData)
  let bool     = campaign.isActive ? 1 : 0
  db.Campaigns.findOne({where: {id: campaign.id}}).then(function (campaign) {
    campaign.update({
      isActive: bool
    }).then(function () {
      res.redirect('/campaigns?updated=true')
    }).catch(function (err) {
      console.log(err)
    })
  })
};

/**
 *  GET /campaigns/reset_conversation/:id
 *
 *  Reset conversation for selected campaign
 */
exports.resetCampaignConversationById = (req, res) => {
    let id = req.params.id

    db.Conversations.findAll({where: {campaign_id: id}}).then(campaigns => {
        for(let i in campaigns){
          campaigns[i].destroy();
        }
        res.redirect('/campaigns?updated=true')
    });
}
