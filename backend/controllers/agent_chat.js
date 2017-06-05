const db = require('../models/index.js')
const SmoochCore =  require('smooch-core')
const request = require('request')

/**
 * GET /chat/agent/:id
 * Get agent`s chats
 */
exports.getAgentChats = (req, res) => {
  let userId = req.params.id || false
  db.Users.findOne({where: {id: userId}, include: [{
    model: db.Campaigns,
  }]}).then(function (user) {

    db.Conversations.findAll({where: { userId: userId }}).then(function (conversations) {

      res.render('agent_chat', {
        user: JSON.stringify(user),
        campaigns: JSON.stringify(user.Campaigns),
        conversations: JSON.stringify(conversations)
      })

    })

  }).catch(function (err) {

    console.log('err1: ', err)
  })
};

/**
 * GET /webchat/campaign/:id
 * Get web chat example
 */
exports.getChatExample = (req, res) => {
  let id = req.params.id || false
  res.render('web_chat_example', {id: id})
};
