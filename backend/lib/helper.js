const db = require('../models/index.js')
const jwt = require('jsonwebtoken')


/**
 * Update stop word
 */
exports.updateStopWord = (stopWords, campaignId) => {

  if (stopWords) {

    // Delete stop words from company
    db.StopWordHasCampaign.destroy({
      where:{
        campaign_id: campaignId
      }
    });

    let words = stopWords.split(",")
    if (words.length > 0) {
      for(let i in words){

        // Filter word, to lowercase and trim spaces from start and end of string
        let w = words[i].toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '')

        if (w) {
          db.StopWords.findOne({where: {word: w}}).then(word => {
            if (word) {
              let obj = {
                stop_word_id: word.id,
                campaign_id: campaignId
              };

              // Attach new word to campaign
              db.StopWordHasCampaign.create(obj);

            } else {
              // Save new stop word
              db.StopWords.create({"word": w}).then(function(data) {
                let obj = {
                  stop_word_id: data.id,
                  campaign_id: campaignId
                };

                // Attach new word to campaign
                db.StopWordHasCampaign.create(obj);
              }).catch(function(err) {
                console.log(8787878878,  err)
              })
            }
          }).catch(function(err) {
            console.log(2323232323,  err)
          })
        }
      }
    }
  }
};

/**
 * Create smooch jwt token
 */
exports.getSmoochJwt = (campaign) => {
  if (campaign && campaign.smooch_app_secret && campaign.smooch_app_key_id) {
      const token = jwt.sign(
          {scope: 'app'},
          campaign.smooch_app_secret,
          {header: { kid: campaign.smooch_app_key_id }
      });
      return token;
  }
};
