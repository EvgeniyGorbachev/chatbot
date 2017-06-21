const db     = require('../models/index.js')
const helper = require('../lib/helper')

/**
 * GET /chat/agent/:id
 * Get agent`s chats
 */
exports.getAgentChats = (req, res, next) => {
  let userId = req.params.id || false

    Promise.all([
            db.Users.findOne({where: {id: userId}, include: [{model: db.Campaigns,}]}),
            db.Conversations.findAll({where: { userId: userId }, include: [{model: db.Campaigns}]})
        ])
        .then(function(data) {
            let user = data[0]
            let conversations = data[1]

            conversations.map(function(conversation) {
                conversation.dataValues.smoochJwt = helper.getSmoochJwt(conversation.Campaign)
                return conversation;
            })

            res.render('agent_chat', {
                user: JSON.stringify(user),
                campaigns: JSON.stringify(user.Campaigns),
                conversations: JSON.stringify(conversations)
            })
        })
        .catch(next);
};

/**
 * GET /webchat/campaign/:id
 * Get web chat example
 */
exports.getChatExample = (req, res) => {
  let id = req.params.id || false
  res.render('web_chat_example', {id: id})
};
