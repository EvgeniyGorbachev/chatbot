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
app.post('/login', passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/login'}), authController.login)

/**
 * Primary app routes.
 */
app.get('/dashboard/:id', authController.ensureAuthenticated, dashboardController.getDashboardById)
app.post('/campaigns', authController.ensureAuthenticated, campaingController.updateCampaignStatus)
app.get('/campaigns', authController.ensureAuthenticated, campaingController.getCampaigns)
app.get('/campaigns/:id', authController.ensureAuthenticated, campaingController.getCampaignById)
app.post('/campaigns/:id',  authController.ensureAuthenticated, campaingController.updateCampaignById)
app.get('/campaigns/delete/:id',  authController.ensureAuthenticated, campaingController.deleteCampaignById)
app.get('/campaigns/reset_conversation/:id',  authController.ensureAuthenticated, campaingController.resetCampaignConversationById)
app.get('/campaigns/:campaignid/sessions',  authController.ensureAuthenticated, sessionsController.getSessionsById)
app.get('/agent/:userid',  authController.ensureAuthenticated, sessionsController.getSessionsByUserId)
app.get('/users', authController.ensureAuthenticated, usersController.getUsers)
app.get('/users/:id', authController.ensureAuthenticated, usersController.getUserById)
app.post('/users/:id',  authController.ensureAuthenticated, usersController.updateUserById)
app.get('/chat/agent/:id', authController.ensureAuthenticated, chatController.getAgentChats)

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

