const db = require('../models/index.js')
const jwt = require('jsonwebtoken')


/**
 * Update stop word
 */
exports.updateStopWord = (stopWords, campaignId) => {

    if (stopWords) {

        // Delete stop words from company
        db.StopWordHasCampaign.destroy({
            where: {
                campaign_id: campaignId
            }
        });

        let words = stopWords.split(",")
        if (words.length > 0) {
            words.map(function(word) {

                // Filter word, to lowercase and trim spaces from start and end of string
                let w = word.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '')

                if (w) {
                    db.StopWords.findOne({
                            where: {
                                word: w
                            }
                        })
                        .then(function(word) {
                            if (word) {
                                let obj = {
                                    stop_word_id: word.id,
                                    campaign_id: campaignId
                                };

                                // Attach new word to campaign
                                db.StopWordHasCampaign.create(obj);
                                return Promise.resolve(undefined)

                            } else {
                                // Save new stop word
                                return db.StopWords.create({
                                    "word": w
                                })
                            }
                        })
                        .then(function(data) {
                            if (data) {
                                let obj = {
                                    stop_word_id: data.id,
                                    campaign_id: campaignId
                                };

                                // Attach new word to campaign
                                db.StopWordHasCampaign.create(obj);
                            }
                        })
                        .catch(function(err) {
                            console.log(err)
                        })
                }
            })
        }
    }
};

/**
 * Create smooch jwt token
 */
exports.getSmoochJwt = (campaign) => {
    if (campaign && campaign.smooch_app_secret && campaign.smooch_app_key_id) {
        const token = jwt.sign({
                scope: 'app'
            },
            campaign.smooch_app_secret, {
                header: {
                    kid: campaign.smooch_app_key_id
                }
            });
        return token;
    }
};