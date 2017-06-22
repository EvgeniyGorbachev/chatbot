const passport = require('passport')
const Strategy = require('passport-local').Strategy
const db = require('../models/index.js')

module.exports = function(options) {

    passport.serializeUser(function(user, cb) {
        cb(null, user.id)
    })

    passport.deserializeUser(function(id, cb) {
        db.Users.findOne({
                where: {
                    id: id
                },
                include: [{
                    model: db.Roles
                }]
            })
            .then(function(user) {
                cb(null, user)
            })
            .catch(function(err) {
                return cb('err')
            })
    })

    /**
     * Sign in using Username and Password.
     */
    passport.use(new Strategy(
        function(username, password, done) {
            db.Users.findOne({
                    where: {
                        username: username
                    },
                    include: [{
                        model: db.Roles
                    }]
                })
                .then(function(user) {
                    if (!user) {
                        return done(null, false)
                    }
                    if (user.password != password) {
                        return done(null, false)
                    }
                    return done(null, user)
                })
                .catch(function(err) {
                    return done(err)
                })
        }
    ))
}