'use strict';

var pg      = require('pg')
var knex    = require('knex')
var async   = require('async')
var Promise = require('bluebird');

var db = knex({
    client    : process.env.DB_TYPE,
    connection: {
        host    : process.env.DB_HOST,
        user    : process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
})

var conversationsTable  = 'conversations';
var conversationHistory = 'conversation_history';

function processMessage(appId, userId, text, isCallback, completeOrder, invoiceId)
{


    var campaignTable   = 'campaign';
    var phrases         = new Array();
    var userSteps       = new Array();
    var callBackSteps   = new Array();
    var currentStep     = {};
    var currentCampaign = {};
    var isPaused        = false;
    var pauseInitiator  = false;
//    console.log("TO", appId);
//    console.log("FROM", userId);
    return new Promise(function (resolve, reject)
    {
        async.waterfall([
            //
            // get campaign
            //
            function (cb)
            {
//                console.log("------------------------------------");
                db.select('*')
                    .from(campaignTable)
                    .where({smooch_app_id: appId, isActive: true})
                    .limit(1)
                    .then((campaign) =>
                    {


                        campaign        = campaign[0];
                        currentCampaign = campaign;

                        phrases = campaign.phrases;
                        processPhrasesList(phrases);
                        return cb(null, campaign);
                    })
                    .catch((err, data) =>
                    {
                        return cb(err, data)
                    });
            },
            //
            // get conversation
            //
            function (campaign, cb)
            {
                db.select('*')
                    .from(conversationsTable)
                    .where({sender: userId, campaign_id: currentCampaign.id})
                    .limit(1)
                    .then(function (conversation)
                    {
                        return cb(null, conversation)
                    })
                    .catch((err, data) =>
                    {
                        console.log("ERRR", err, data);
                        return cb(err, data)
                    })
            },
            //
            // create if new conversation started
            //
            function (conversation, cb)
            {
                if (conversation.length == 0) {
                    if (!isCallback) {
                        db.insert({sender: userId, last_phrase_id: 1}).into(conversationsTable)
                            .returning('id')
                            .then(function (conversationsId)
                            {
                                currentStep = phrases[1];
                                // console.log("converstaion ID", conversationsId);
                                return db.select('*')
                                    .from(conversationsTable)
                                    .where({id: parseInt(conversationsId)})
                                    .limit(1)
                            })
                            .then(function (conversation)
                            {
                                return cb(null, conversation)
                            })
                            .catch((err, data) =>
                            {
                                console.log(err)
                                return cb(err, data)
                            })
                    } else {
                        return cb("NOT SMS");
                    }
                } else {
                    var tC         = conversation[0];
                    isPaused       = tC.isPaused;
                    pauseInitiator = tC.pauseInitiator;
                    if (isPaused) {
                        return cb(null, conversation);
                    }
                    if (currentStep = phrases[phrases[tC.last_phrase_id].nextStep.default]) {


                        if (("boolean" == phrases[tC.last_phrase_id].response) && text) {

                            if ("Y" == text.toUpperCase()) {

                                currentStep = phrases[phrases[tC.last_phrase_id].nextStep.ifYes];
                            } else {

                                currentStep = phrases[phrases[tC.last_phrase_id].nextStep.ifNo];
                            }

                        }

//                    console.log("LAST PHRASE", tC.last_phrase_id);
//                    console.log("USER STEP", userSteps);
//                    console.log("BOT STEP", callBackSteps);

                        if (isCallback) {
                            if (userSteps.indexOf(currentStep.id) >= 0) {
                                return cb(currentStep.id)
                            }

                        } else {
                            if (callBackSteps.indexOf(currentStep.id) >= 0) {
                                return cb(currentStep.id)
                            }
                        }

                        if (("external_request" == currentStep.initiator) && !completeOrder) {
                            return cb(currentStep.id)
                        }
                        if (completeOrder && ("external_request" != currentStep.initiator)) {
                            return cb(currentStep.id)
                        }

//                    if (tC.last_phrase_id >= getLastStepID()) {
//                        return cb(tC.last_phrase_id)
//                    }

                        return cb(null, conversation)
                    } else {
                        return cb("Over step count");
                    }
                }
            },

            //
            // Check stop words
            //
            function (conversation, cb)
            {
                console.log("CHECK STOP WORDS");
                var tC = conversation[0];
                if (isPaused) {
                    return cb(null, conversation);
                }
                console.log("HHHH");
                if (text && tC.campaign_id) {
                    let searchWord = text.trim().toLowerCase().split(' ');

                    console.log("SWWW: ",searchWord);
                    db
                        .count('stop_words.id')
                        .from('stop_words')
                        .innerJoin('stopWordHasCampaign', 'stopWordHasCampaign.stop_word_id', 'stop_words.id ')
                        .whereIn('stop_words.word', searchWord)
                        .andWhere('stopWordHasCampaign.campaign_id', tC.campaign_id)
                        .then((data) => {
                            var tData = data[0];
                            console.log("SEARCH RESULT", data);
                            if (tData.count > 0) {
                                isPaused       = true;
                                pauseInitiator = 'bot'+Date.now();
                            }
                            return cb(null, conversation)
                        });
                } else {
                    return cb(null, conversation)
                }
            },
            //
            // sanitize answers
            //
            function (conversation, cb)
            {
                //Check stop words

                conversation         = conversation[0]
                if (typeof conversation.answers === 'string') {
                    try {
                        conversation.answers = JSON.parse(conversation.answers)
                    } catch (e) {
                        conversation.answers = []
                    }
                }
                return cb(null, conversation)
            },
            //
            // save answer
            //
            function (conversation, cb)
            {
//                console.log("CURRENT STEP", currentStep);
//                conversation         = conversation[0]
                try {
                    conversation.answers = JSON.parse(conversation.answers)
                } catch (e) {
                    conversation.answers = []
                }

                if (conversation.answers == null) {
                    conversation.answers = [];
                }

                var doc            = {last_phrase_id: currentStep.id, answers: conversation.answers};
                doc.username       = conversation.username;
                doc.email          = conversation.email;
                doc.sender         = conversation.sender;
                doc.address        = conversation.address;
                doc.campaign_id    = currentCampaign.id;
                doc.isPaused       = isPaused;
                doc.pauseInitiator = pauseInitiator;

                if ("no" != phrases[conversation.last_phrase_id].response) {
                    if ("boolean" != phrases[conversation.last_phrase_id].response) {
                        doc[phrases[conversation.last_phrase_id].response] = text;
                    }
                    if ("boolean" == phrases[conversation.last_phrase_id].response) {
                        if (text) {
                            text = text.toUpperCase();
                        }
                    }
                    doc.answers.push({id: conversation.last_phrase_id, text: text});
                }

                doc.answers = JSON.stringify(doc.answers)

                console.log("DOC: ", doc);

                db(conversationsTable)
                    .where({id: conversation.id})
                    .update(doc)
                    .then(function ()
                    {



                        var nextPhrase = preparePhrase(currentStep.id, doc, invoiceId);

                        return db.insert({
                            user_id    : conversation.sender,
                            campaign_id: currentCampaign.id,
                            text       : text,
                            direction  : 0
                        }).into(conversationHistory).then(function ()
                        {

                            console.log("INSERT INTO CONVERSATION HISTORY: ", Date.now());
                            console.log({
                                user_id    : conversation.sender,
                                campaign_id: currentCampaign.id,
                                text       : nextPhrase,
                                direction  : 1
                            });

                            if(nextPhrase) {
                                return db.insert({
                                    user_id    : conversation.sender,
                                    campaign_id: currentCampaign.id,
                                    text       : nextPhrase,
                                    direction  : 1
                                }).into(conversationHistory)
                                    .then(function ()
                                    {

                                        if (isPaused) {
                                            return cb("Conversation paused");
                                        }

                                        var obj = {
                                            id    : parseInt(currentStep.id),
                                            text  : nextPhrase,
                                            delay : currentStep.delay,
                                            key   : currentCampaign.smooch_app_key_id,
                                            secret: currentCampaign.smooch_app_secret
                                        }

//                        console.log("OBJ", obj);

                                        if (obj.id == getLastStepID()) {
                                            return deleteConversation(conversation.sender).then(function (conversation)
                                            {
                                                return cb(null, obj)
                                            })
                                                .catch((err, data) =>
                                                {
                                                    console.log(err)
                                                    return cb(err, data)
                                                })
                                        } else {
                                            return cb(null, obj)
                                        }
                                    })
                            }else{
                                if (isPaused) {
                                    return cb("Conversation paused");
                                }else{
                                    return cb("No response");
                                }
                            }
                        });


                    })
                    .catch((err, data) =>
                    {
                        return cb(err, data)
                    })
            }
        ], function (err, result)
        {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })


    function preparePhrase(id, conversations, invoiceId)
    {
        var pendingText;
        var answers = JSON.parse(conversations.answers)

        if(pendingText = currentStep.text){

            var userJsonString   = JSON.stringify({
                "userName"   : conversations.username,
                "appUserId"  : conversations.sender,
                "email"      : conversations.email,
                "address"    : conversations.address,
                "campaign_id": conversations.campaign_id,
                "appId"      : currentCampaign.smooch_app_id
            });
            var userBase64String = new Buffer(userJsonString).toString('base64')

            var invoiceJsonString   = JSON.stringify({"id": invoiceId});
            var invoiceBase64String = new Buffer(invoiceJsonString).toString('base64')

            var link        = process.env.PAYMENT_HOST_LINK + '/#/main/' + userBase64String
            var invoiceLink = process.env.PAYMENT_HOST_LINK + '/#/invoice/' + invoiceBase64String


                pendingText = pendingText.replace('[name]', conversations.username)
                pendingText = pendingText.replace('[email]', conversations.email)
                pendingText = pendingText.replace('[link]', link)
                pendingText = pendingText.replace('[invoice link]', invoiceLink)
        }

        return pendingText;

        function getAnswer(step_id)
        {
            for (var i in answers) {
                if (answers[i].id == step_id) {
                    return answers[i].text;
                }
            }
        }
    }

    function deleteConversation(sender)
    {
        return db.select('*')
            .from(conversationsTable)
            .where({sender: sender, campaign_id: currentCampaign.id})
            .del()
    }

    function processPhrasesList(phrases)
    {
        userSteps     = [];
        callBackSteps = [];
        for (var i in phrases) {
            if ("user" == phrases[i].initiator) {
                userSteps.push(parseInt(i));
            } else {
                callBackSteps.push(parseInt(i))
            }
        }
    }

    function getCurrentPhrase(step)
    {
        return phrases[step];
    }

    function getLastStepID()
    {
        let k = -1;
        for (let i in phrases) {
            if (parseInt(phrases[i].id) > k) {
                k = parseInt(phrases[i].id);
            }
        }
        return k;
    }
}


module.exports = {
    processMessage     : processMessage,
    db                 : db,
    conversationsTable : conversationsTable,
    conversationHistory: conversationHistory
}
