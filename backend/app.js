const express    = require('express')
const app        = express()
const cors       = require('cors')
const bodyParser = require('body-parser')
const request    = require('request')
const passport   = require('passport')

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
require('dotenv').config()

/**
 * Controllers (route handlers).
 */
const campaingController = require('./controllers/campaigns')
const dashboardController = require('./controllers/dashboard')
const apiController = require('./controllers/api')
const authController = require('./controllers/authentication')
const sessionsController = require('./controllers/sessions')
const usersController = require('./controllers/users')

/**
 * WebSocket.
 */
require('./websocket')

/**
 * API keys and Passport configuration.
 */
require('./config/passport')({'app': app})

/**
 * Express configuration.
 */
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.set('view engine', 'pug')
app.use("/assets", express.static(__dirname + '/assets'))
app.use(cors())

app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({extended: true}))
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}))

app.use(passport.initialize())
app.use(passport.session())


/**
 * Authentication routes.
 */
app.get('/login', authController.getLoginPage)
app.get('/logout', authController.logout)
app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), authController.login)

/**
 * Primary app routes.
 */
app.get('/dashboard/:id', require('connect-ensure-login').ensureLoggedIn(), dashboardController.getDashboardById)
app.post('/campaigns', require('connect-ensure-login').ensureLoggedIn(), campaingController.updateCampaignStatus)
app.get('/campaigns', require('connect-ensure-login').ensureLoggedIn(), campaingController.getCampaigns)
app.get('/campaigns/:id', require('connect-ensure-login').ensureLoggedIn(), campaingController.getCampaignById)
app.post('/campaigns/:id',  require('connect-ensure-login').ensureLoggedIn(), campaingController.updateCampaignById)
app.get('/campaigns/delete/:id',  require('connect-ensure-login').ensureLoggedIn(), campaingController.deleteCampaignById)
app.get('/campaigns/:campaignid/sessions',  require('connect-ensure-login').ensureLoggedIn(), sessionsController.getSessionsById)
app.get('/agent/:userid',  require('connect-ensure-login').ensureLoggedIn(), sessionsController.getSessionsByUserId)
app.get('/users', require('connect-ensure-login').ensureLoggedIn(), usersController.getUsers)

/**
 * API routes.
 */
app.get('/campaigns/delete/:id', apiController.welcome)
app.post('/api/user', apiController.paymentProcessing)
app.get('/api/invoice/:id', apiController.getInvoice)

app.use((req, res, next) => {
    res.redirect('/login')
})

/**
 * Start Express server.
 */
app.listen(8181, () => {
    console.log('App listening on port 8181!')
})
