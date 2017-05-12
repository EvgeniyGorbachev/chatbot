const db         = require('../models/index.js');
const SmoochCore = require('smooch-core');
const request    = require('request');

/**
 * POST /webhook/web-chat
 * Webhook for web chat (Smooch integration)
 */
exports.smoochWebChat = (req, res) =>
{
  console.log('Get webhookkkkkk: ', req.body);
  req.dashboardChatSocket.emit('webhook', {type: 'new message', userId: req.body.appUser['_id'], appId: req.body.app['_id']});
  res.sendStatus(201);
};