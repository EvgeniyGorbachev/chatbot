const request = require('request')
const db = require('../models/index.js')

/**
 * POST /webhook/web-chat
 * Webhook for web chat (Smooch integration)
 */
exports.webChat = (req, res, next) => {

    res.sendStatus(201)
    console.log('Get webhookkkkkk: ', req.body)

    if (req.body.trigger == 'message:appMaker') {

        // Attach manager to conversation
        if (req.body.appUser && req.body.appUser['_id']) {
            console.log('attachConversationToAgent  by appMaker')
            attachConversationToAgent(req)
        }

        console.log(req.body)

        req.dashboardChatSocket.emit('webhook', {
            type: 'new message from bot',
            userId: req.body.appUser['_id'],
            appId: req.body.app['_id'],
            messages: req.body.messages
        })
    }

    if (req.body.trigger == 'message:appUser') {
        console.log(req.body)
        req.dashboardChatSocket.emit('webhook', {
            type: 'new message from user',
            userId: req.body.appUser['_id'],
            appId: req.body.app['_id'],
            messages: req.body.messages
        })
        console.log('attachConversationToAgent  by appUser')

        // Attention HACK, 7 seconds we wait while the chat bot in a database creates record
        setTimeout(attachConversationToAgent, 7000, req)
    }

    function attachConversationToAgent(req) {
        if (req.body.appUser['_id'] && req.body.app['_id']) {
            db.Conversations.findOne({
                    where: {
                        sender: req.body.appUser['_id']
                    }
                })
                .then(function(conv) {
                    if (conv && conv.userId == null) {
                        // Attention HARDCODE
                        return conv.update({
                            "userId": '1'
                        })
                    } else {
                        return Promise.resolve(undefined)
                    }
                })
                .then(function(conversation) {
                    if (conversation) {
                        req.dashboardChatSocket.emit('webhook', {
                            type: 'new conversation added',
                            userId: req.body.appUser['_id'],
                            appId: req.body.app['_id'],
                            agentId: conversation.userId
                        })
                    }
                })
                .catch(next)
        }
    }

};