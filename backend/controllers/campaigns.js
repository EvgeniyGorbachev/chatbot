const db = require('../models/index.js')

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
  let id = req.params.id

  db.Campaigns.findOne({ where: {id: id} }).then(function(campaign) {
    let data = JSON.stringify(campaign)
    res.render('campaigns_edit', {campaign: data})
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
        let data = JSON.stringify(campaign)
        res.redirect('/campaigns?updated=true');
      }).catch(function(err) {
        console.log(err)
        res.render('campaigns_edit', {err: 'Update wrong'})
      })
    }).catch(function(err) {
      console.log(err)
      db.Campaigns.all().then(function (campaigns)
      {
        res.render('campaigns', {
          campaignList: campaigns,
          err         : 'Campaign not found'
        })
      })
    })
    //if create
  } else {
    db.Campaigns.create(campaign).then(function(data) {
      res.redirect('/campaigns?created=true');
    }).catch(function(err) {
      console.log(err)
      res.render('campaigns_edit', {err: 'Saved wrong'})
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
