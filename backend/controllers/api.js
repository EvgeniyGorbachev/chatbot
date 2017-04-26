const db      = require('../models/index.js')
const hash    = require('object-hash')
const request = require('request')

/**
 * GET /api
 * Welcome API page
 */
exports.welcome = (req, res) => {
  res.json({msg: 'Chatbot payment REST API'})
};

/**
 * POST /api/user
 * User payment processing
 */
exports.paymentProcessing = (req, res) => {
  var shipping = JSON.stringify(req.body.shipping)
  var billing  = JSON.stringify(req.body.billing)

  var user = {
    userName    : req.body.shipping.firstName + " " + req.body.shipping.lastName,
    invoiceId   : '',
    email       : req.body.shipping.email,
    phone       : req.body.phone,
    campaign_id : req.body.campaign_id,
    shipping    : shipping,
    billing     : billing
  }

  user.invoiceId = hash(user)

  db.Users.create(user).then(function (model) {

    // Set the headers
    var headers = {
      'User-Agent'  : 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    // Configure the request
    var options = {
      url    : process.env.CONFIRM_ORDER_CALLBACK,
      method : 'POST',
      headers: headers,
      body: JSON.stringify({
        'To'            : req.body.phone,
        'From'          : req.body.from,
        'orderCompleted': 'true',
        'invoiceId'     : user.invoiceId,
        'SmsStatus'     : 'success'
      }),
    }

    console.log("REQUEST options", options)

    // Start the request
    request(options, function (error, response, body) {
      console.log("RESPONSE")
      console.log(error, response, body)
      if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
      }
      res.json({msg: 'Saved successfully'})

    })

  }).catch(db.Sequelize.ValidationError, function (err) {
    console.log(err)
    res.json({msg: 'Database error, unsaved.'})
  }).catch(function (err) {
    console.log("error", err)
    res.status(500).json({msg: 'An error has occurred'})
  })
};

/**
 * GET /api/invoice/:id
 * Get invoice by id
 */
exports.getInvoice = (req, res) => {
  db.Users.findOne({where: {invoiceId: req.params.id}, plain: true}).then(function (user) {

    if (user != null) {
      user.billing  = JSON.parse(user.billing)
      user.shipping = JSON.parse(user.shipping)
      res.json(user)
    } else {
      res.json({msg: 'Wrong invoice ID'})
    }

  }).catch(function (err) {
    res.status(500).json({msg: 'An error has occurred'})
    console.log(err)
  })
};