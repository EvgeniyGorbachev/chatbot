var passport   = require('passport')
var Strategy   = require('passport-local').Strategy
var user = {id: '1', username: process.env.LOGIN_USERNAME, password: process.env.LOGIN_PASSWORD}


passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  if (user.id != id) {
    return cb('err')
  }
  cb(null, user)
})

/**
 * Sign in using Username and Password.
 */
passport.use(new Strategy(
  function (username, password, cb) {
    if (user.username != username) {
      return cb(null, false)
    }
    if (user.password != password) {
      return cb(null, false)
    }
    return cb(null, user)
  }))