require('dotenv').config()
var express    = require('express')
var app        = express()
var cors       = require('cors')
var bodyParser = require('body-parser')
var request    = require('request')
var db         = require('./models/index.js')
var hash       = require('object-hash')
var passport   = require('passport')
var Strategy   = require('passport-local').Strategy

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.set('view engine', 'pug')
app.use("/assets", express.static(__dirname + '/assets'))
app.use(cors())

app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({extended: true}))
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}))

var user = {id: '1', username: process.env.LOGIN_USERNAME, password: process.env.LOGIN_PASSWORD}

passport.use(new Strategy(
    function (username, password, cb)
    {
        if (user.username != username) {
            return cb(null, false)
        }
        if (user.password != password) {
            return cb(null, false)
        }
        return cb(null, user)
    }))

passport.serializeUser(function (user, cb)
{
    cb(null, user.id)
})

passport.deserializeUser(function (id, cb)
{
    if (user.id != id) {
        return cb('err')
    }
    cb(null, user)
})

app.use(passport.initialize())
app.use(passport.session())

app.get('/login', function (req, res)
{
    res.render('login', {title: 'Hey', message: 'Hello there!'})
})

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res)
    {
        res.redirect('/dashboard')
    })

app.get('/logout', function (req, res)
{
    req.logout()
    res.redirect('/login')
})

app.get('/dashboard/:id*?',
    // require('connect-ensure-login').ensureLoggedIn(),
    function (req, res)
    {
        let id = req.params.id || false
        db.Users.all().then(function (users)
        {
            db.Conversations.all().then(function (conversations)
            {
                res.render('dashboard', {
                    paymentList  : users,
                    conversations: conversations,
                    id           : id
                })
            })
        })
    })

app.post('/dashboard',
    // require('connect-ensure-login').ensureLoggedIn(),
    function (req, res)
    {
        let campaign = JSON.parse(req.body.jsonData)
        let bool     = campaign.isActive ? 1 : 0
        db.Campaigns.findOne({where: {id: campaign.id}}).then(function (campaign)
        {
            campaign.update({
                isActive: bool
            }).then(function ()
            {
                res.redirect('/dashboard')
            }).catch(function (err)
            {
                console.log(err)
            })
        })

    })

app.get('/campaigns',
    // require('connect-ensure-login').ensureLoggedIn(),
    function (req, res)
    {
        db.Campaigns.all().then(function (campaigns)
        {
            res.render('campaigns', {
                campaignList: campaigns
            })
        })

    })
app.get('/campaigns/:id',
  // require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    let id = req.params.id

    db.Campaigns.findOne({ where: {id: id} }).then(function(campaign) {
      let data = JSON.stringify(campaign)
      res.render('campaigns', { campaign:data })
    }).catch(function(err) {
      console.log(err)
      res.redirect('/dashboard')
    })
})

app.post('/campaigns',
  // require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
  let campaign = JSON.parse(req.body.jsonData)

        campaign.startDate = (new Date(campaign.startDate))
        campaign.endDate   = (new Date(campaign.endDate))

    //if update
    if (campaign.id) {
      db.Campaigns.findOne({ where: {id: campaign.id} }).then(function(item) {
        item.update(campaign).then(function() {
          res.render('campaigns', {updated: 'Updated successful'})
        }).catch(function(err) {
          console.log(err)
          res.render('campaigns', {err: 'Update wrong'})
        })
      }).catch(function(err) {
        console.log(err)
        res.render('campaigns', {err: 'Campaign not found'})
      })
    //if create
    } else {
      db.Campaigns.create(campaign).then(function(data) {
        res.redirect('/dashboard/' + data.id);
      }).catch(function(err) {
        console.log(err)
        res.render('campaigns', {err: 'Saved wrong'})
      })
    }
})

app.get('/api', function (req, res)
{
    res.json({msg: 'Chatbot payment REST API'})
})

app.post('/api/user', function (req, res)
{

    var shipping = JSON.stringify(req.body.shipping)
    var billing  = JSON.stringify(req.body.billing)

    var user = {
        userName : req.body.shipping.firstName + " " + req.body.shipping.lastName,
        invoiceId: '',
        email    : req.body.shipping.email,
        phone    : req.body.phone,
        shipping : shipping,
        billing  : billing
    }

    user.invoiceId = hash(user)

    db.Users.create(user).then(function (model)
    {

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
            form   : {
                'To'            : req.body.phone,
                'orderCompleted': 'true',
                'invoiceId'     : user.invoiceId,
                'SmsStatus'     : 'delivered'
            },
        }

        console.log("REQUEST options", options)

// Start the request
        request(options, function (error, response, body)
        {
            console.log("RESPONSE")
            console.log(error, response, body)
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
            res.json({msg: 'Saved successfully'})

        })

    }).catch(db.Sequelize.ValidationError, function (err)
    {
        console.log(err)
        res.json({msg: 'Invalid json on shipping and billing'})
    }).catch(function (err)
    {
        res.status(500).json({msg: 'An error has occurred'})
    })

})

app.get('/api/invoice/:id', function (req, res)
{

    db.Users.findOne({where: {invoiceId: req.params.id}, plain: true}).then(function (user)
    {

        if (user != null) {
            user.billing  = JSON.parse(user.billing)
            user.shipping = JSON.parse(user.shipping)
            res.json(user)
        } else {
            res.json({msg: 'Wrong invoice ID'})
        }

    }).catch(function (err)
    {
        res.status(500).json({msg: 'An error has occurred'})
        console.log(err)
    })
})

app.use(function (req, res, next)
{
    res.redirect('/login')
})

app.listen(8181, function ()
{
    console.log('Sample app listening on port 8181!')
})
