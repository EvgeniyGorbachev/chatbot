var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var fs = require('fs')
var jsonfile = require('jsonfile')


app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

app.use(cors())

app.get('/api', function (req, res) {
  res.json({msg: 'Chatbot payment REST API'})
})

app.post('/api/user', function (req, res) {
  jsonfile.writeFile('db.json', req.body,  {flag: 'a'}, function (err) {
    if(err) {
      res.send({msg: err})
    }

    res.send({msg: 'Saved'})
  })
})

app.get('/api/user', function (req, res) {
  jsonfile.readFile('db.json', function(err, obj) {
    res.send(obj)
    console.log(obj)
  })
})

app.use(function(req, res, next) {
  res.status(404).send({msg: 'Chatbot payment REST API: wrong path!'})
})

app.listen(8181, function () {
  console.log('Example app listening on port 8181!')
})