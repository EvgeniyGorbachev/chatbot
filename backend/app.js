var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
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

  db.Users.create({ userName: req.body.userName, email: req.body.email, phone: req.body.phone, shipping: shipping, billing: billing}).then(function(model) {
    res.json({msg: 'Saved successfully'})
  }).catch(db.Sequelize.ValidationError, function(err) {
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
  console.log('Example app listening on port 8181!')
})