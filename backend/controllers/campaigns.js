const db      = require('../models/index.js')
const helper  = require('../lib/helper')
const request = require('request')

/**
 * GET /campaigns
 * List of campaigns.
 */
exports.getCampaigns = (req, res, next) => {
  db.Campaigns.all({order: 'id DESC'}).then(function (campaigns) {
      res.render('campaigns', {
          campaignList  : campaigns,
          updated       : req.query.updated,
          deleted       : req.query.deleted,
          created       : req.query.created,
          err           : req.query.err
      })
  })
  .catch(next);
};

/**
 * GET /campaigns/:id
 * Get campaign by id.
 */
exports.getCampaignById = (req, res, next) => {

  let id = req.params.id

    Promise.all([
            db.Campaigns.findOne({ where: {id: id}, include: [{model: db.StopWords}]}),
            db.Users.all({order: 'id DESC'}),
            db.UsersHasCampaign.findAll({where: {campaign_id: id}})
        ])
        .then(function(data) {
            let campaign = data[0]
            let users = data[1]
            let items = data[2]

            let usersId = []
            items.forEach(function(item) {
                usersId.push(item.user_id);
            });

            if (campaign.StopWords.length > 0){
                let stop_word_string = ''

                campaign.StopWords.forEach(function(StopWord) {
                    stop_word_string +=  StopWord.word + ', '
                })

                campaign.dataValues.stop_word = stop_word_string;
            }

            campaign.dataValues.users = usersId;

            res.render('campaigns_edit', {
                campaign: JSON.stringify(campaign),
                users: users
            })
        })
        .catch(next);
};

/**
 * POST /campaigns/:id
 * Update campaign by id.
 */
exports.updateCampaignById = (req, res, next) => {
  let campaign = JSON.parse(req.body.jsonData)

  campaign.startDate = (new Date(campaign.startDate))
  campaign.endDate   = (new Date(campaign.endDate))

  //if update
  if (campaign.id) {
      db.Campaigns.findOne({ where: {id: campaign.id} })
          .then(function (item) {
              return item.update(campaign)
          })
          .then(function () {
              if(campaign.users){
                  db.UsersHasCampaign.destroy({
                      where:{
                          campaign_id: campaign.id
                      }
                  });

                  campaign.users.forEach(function (user) {
                      let obj = {
                          user_id: user,
                          campaign_id: campaign.id
                      };

                      db.UsersHasCampaign.create(obj);
                  })

              } else {
                  db.UsersHasCampaign.destroy({
                      where:{
                          campaign_id: campaign.id
                      }
                  });
              }

              // Update stop word
              helper.updateStopWord(campaign.stop_word, campaign.id)

              return res.redirect('/campaigns?updated=true');
          })
          .catch(function (err) {
              console.log(err)
              return res.redirect('/campaigns?update=false');
              next()
          })
    //if create
  } else {

    let smooch = req.smooch

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

        let integrationData = {}
        if (campaign.channel == 'sms') {
           integrationData = {
             type: 'twilio',
             accountSid: process.env.TWILIO_ACCOUNT_SID,
             authToken: process.env.TWILIO_AUTH_TOKEN,
             phoneNumberSid: campaign.twilio_phone_number_sid
           }
        } else if (campaign.channel == 'facebook') {
          campaign.phone = 'facebook'

          integrationData = {
            type: 'messenger',
            pageAccessToken: campaign.facebook_app_page_access_token,
            appId: campaign.facebook_app_id,
            appSecret: campaign.facebook_app_secret
          }
        } else {
          console.log(31313131331313, err)
          return res.render('campaigns_edit', {errSmooch: 'Unsupported channel type'})
        }

        // Smooch add twilio integration
        smooch.integrations.create(campaign.smooch_app_id, integrationData).then((response) => {

          // Smooch add webhook for chatbot (Lambda)
            smooch.webhooks.create(campaign.smooch_app_id, {
            target: process.env.CONFIRM_ORDER_CALLBACK,
            triggers: '*'
          }).then((response) => {

            // Smooch add webhook for dashboard_chat.js
              smooch.webhooks.create(campaign.smooch_app_id, {
              target: process.env.WEBCHAT_WEBHOOK,
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

                // Update stop word
                helper.updateStopWord(campaign.stop_word, data.id)



                res.redirect('/campaigns?created=true');
              }).catch(function(err) {
                console.log(5555,  err)
                return res.render('campaigns_edit', {err: 'Saved wrong'})
              })

            }).catch(function(err) {
              console.log(101010101010, err)
              return res.render('campaigns_edit', {errSmooch: 'Smooch: Can not add Webhook for WebChat UI'})
            })


          }).catch(function(err) {
            console.log(11111, err)
            return res.render('campaigns_edit', {errSmooch: 'Smooch: Can not add Webhook for chatbot(AWS Lambda)'})
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
exports.deleteCampaignById = (req, res, next) => {
  let id = req.params.id

  db.Campaigns.findOne({where: {id: id}})
      .then(function (campaign) {
        return campaign.destroy()
      })
      .then(function () {
          res.redirect('/campaigns?deleted=true');
      })
      .catch(function (err) {
        res.redirect('/campaigns');
        next()
      })
};

/**
 * POST /campaigns/:id
 * Update campaign status.
 */
exports.updateCampaignStatus = (req, res, next) => {
  let campaign = JSON.parse(req.body.jsonData)
  let bool     = campaign.isActive ? 1 : 0
  db.Campaigns.findOne({where: {id: campaign.id}})
    .then(function (campaign) {
        campaign.update({isActive: bool})
    })
    .then(function () {
      res.redirect('/campaigns?updated=true')
    })
    .catch(next)
};

/**
 *  GET /campaigns/reset_conversation/:id
 *
 *  Reset conversation for selected campaign
 */
exports.resetCampaignConversationById = (req, res, next) => {
    let id = req.params.id

    db.Conversations.findAll({where: {campaign_id: id}})
        .then(campaigns => {
            if (campaigns) {
                campaigns.map(function(campaign) {
                    campaign.destroy();
                })
            }
            res.redirect('/campaigns?updated=true')
        })
        .catch(next)
}
