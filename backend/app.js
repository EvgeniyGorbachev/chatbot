require('dotenv').config()
var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var request = require('request');
var db = require('./models/index.js')

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

app.use(cors())

app.get('/api', function (req, res) {
  res.json({msg: 'Chatbot payment REST API'})
})

app.post('/api/user', function (req, res) {

  var shipping = JSON.stringify(req.body.shipping)
  var billing = JSON.stringify(req.body.billing)

  db.Users.create({ userName: req.body.shipping.firstName+" "+req.body.shipping.lastName, email: req.body.shipping.email, phone: req.body.phone, shipping: shipping, billing: billing}).then(function(model) {
    res.json({msg: 'Saved successfully'})

    // Set the headers
    var headers = {
      'User-Agent':       'Super Agent/0.0.1',
      'Content-Type':     'application/x-www-form-urlencoded'
    }

// Configure the request
    var options = {
      url: process.env.CONFIRM_ORDER_CALLBACK,
      method: 'POST',
      headers: headers,
      form: {'To': req.body.phone, 'orderCompleted': 'true', 'SmsStatus': 'delivered'},
    }

    console.log("REQUEST options", options);

// Start the request
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
      }
    })

  }).catch(db.Sequelize.ValidationError, function(err) {
    console.log(err);
    res.json({msg: 'Invalid json on shipping and billing'})
  }).catch(function(err) {
    res.json({msg: 'An error has occurred'})
  })

})

app.get('/api/user', function (req, res) {
  // db.Users.all().then(function(users) {
  //   res.json(users)
  // })
})

app.use(function(req, res, next) {
  res.status(404).send({msg: 'Chatbot payment REST API: wrong path!'})
})

app.listen(8181, function () {
  console.log('Sample app listening on port 8181!')
})