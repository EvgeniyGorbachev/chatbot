var express = require('express')
var app = express()

app.get('/api', function (req, res) {
  res.json({msg: 'Chatbot payment REST API'})
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use(function(req, res, next) {
  res.status(404).send({msg: 'Chatbot payment REST API: wrong path!'})
})

app.listen(8181, function () {
  console.log('Example app listening on port 8181!')
})