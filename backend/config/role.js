const db = require('../models/index.js')

/**
 * Require user role
 */
exports.require = (roles) => {
  return function(req, res, next) {

    let isClose = true

    if (roles && roles.length > 0) {
      roles.forEach(function(role) {
        if(req.user && req.user.Role && req.user.Role.name === role) {
          next()
          isClose = false
        }
      })
    } else {
      console.error('Init check, but not set roles name to controller!')
    }

    if (isClose) {
      res.sendStatus(403)
    }
  }
};