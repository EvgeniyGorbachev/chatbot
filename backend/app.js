require('dotenv').config()
var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var request = require('request');
var db = require('./models/index.js')
var hash = require('object-hash')

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.set('view engine', 'pug')
app.use("/assets", express.static(__dirname + '/assets'));
app.use(cors())

app.get('/api', function (req, res) {
  res.json({msg: 'Chatbot payment REST API'})
})

app.get('/login', function (req, res) {
  res.render('login', { title: 'Hey', message: 'Hello there!' })
})

app.get('/dashboard', function (req, res) {
  res.render('dashboard', { title: 'Hey', message: 'Hello there!' })
})

app.post('/api/user', function (req, res) {

  var shipping = JSON.stringify(req.body.shipping)
  var billing = JSON.stringify(req.body.billing)

  var user = {
    userName: req.body.shipping.firstName+" "+req.body.shipping.lastName,
    invoiceId: '',
    email: req.body.shipping.email,
    phone: req.body.phone,
    shipping: shipping,
    billing: billing
  }

  user.invoiceId = hash(user);

  db.Users.create(user).then(function(model) {

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
      form: {'To': req.body.phone, 'orderCompleted': 'true', 'invoiceId': user.invoiceId, 'SmsStatus': 'delivered'},
    }

    console.log("REQUEST options", options);

// Start the request
    request(options, function (error, response, body) {
      console.log("RESPONSE");
      console.log(error, response, body);
      if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
      }
      res.json({msg: 'Saved successfully'})

    })

  }).catch(db.Sequelize.ValidationError, function(err) {
    console.log(err);
    res.json({msg: 'Invalid json on shipping and billing'})
  }).catch(function(err) {
    res.status(500).json({msg: 'An error has occurred'})
  })

})

app.get('/api/user', function (req, res) {
  // db.Users.all().then(function(users) {
  //   res.json(users)
  // })
})

app.get('/api/invoice/:id', function (req, res) {

  db.Users.findOne({ where: {invoiceId: req.params.id}, plain: true }).then(function(user) {

    if (user != null) {
      user.billing = JSON.parse(user.billing)
      user.shipping = JSON.parse(user.shipping)
      res.json(user)
    } else {
      res.json({msg: 'Wrong invoice ID'})
    }

  }).catch(function(err) {
    res.status(500).json({msg: 'An error has occurred'})
    console.log(err)
  })
})

app.use(function(req, res, next) {
  res.status(404).send({msg: 'Chatbot payment REST API: wrong path!'})
})

app.listen(8181, function () {
  console.log('Sample app listening on port 8181!')
})