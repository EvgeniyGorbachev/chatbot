const express    = require('express')
const app        = express()
const http       = require('http').Server(app)
const io         = require('socket.io')(http)
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
const chatController = require('./controllers/agent_chat')

/**
 * WebSocket.
 */
let dashboardChatSocket = io.of('/dashboardchat');
let webChatSocket = io.of('/webchat');
require('./websockets/dashboard_chat')(dashboardChatSocket)
require('./websockets/web_chat')(webChatSocket)

/**
 * Webhooks
 */
const webhooks = require('./webhooks/webhooks')


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

/**
 * Make io accessible to app router
 */
app.use(function(req,res,next){
  req.dashboardChatSocket = dashboardChatSocket;
  req.webChatSocket = webChatSocket;
  next();
});

// app.use(require('morgan')('combined'))
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
app.get('/campaigns/reset_conversation/:id',  require('connect-ensure-login').ensureLoggedIn(), campaingController.resetCampaignConversationById)
app.get('/campaigns/:campaignid/sessions',  require('connect-ensure-login').ensureLoggedIn(), sessionsController.getSessionsById)
app.get('/agent/:userid',  require('connect-ensure-login').ensureLoggedIn(), sessionsController.getSessionsByUserId)
app.get('/users', require('connect-ensure-login').ensureLoggedIn(), usersController.getUsers)
app.get('/users/:id', require('connect-ensure-login').ensureLoggedIn(), usersController.getUserById)
app.post('/users/:id',  require('connect-ensure-login').ensureLoggedIn(), usersController.updateUserById)
app.get('/chat/agent/:id', require('connect-ensure-login').ensureLoggedIn(), chatController.getAgentChats)

app.post('/webhook/web-chat', webhooks.webChat)

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
http.listen(8181, () => {
    console.log('App listening on port 8181!')
})

