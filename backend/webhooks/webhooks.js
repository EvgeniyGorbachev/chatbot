const db         = require('../models/index.js');
const SmoochCore = require('smooch-core');
const request    = require('request');

/**
 * POST /webhook/web-chat
 * Webhook for web chat (Smooch integration)
 */
exports.smoochWebChat = (req, res) =>
{
  console.log(999999999, req);

  res.sendStatus(201);
};