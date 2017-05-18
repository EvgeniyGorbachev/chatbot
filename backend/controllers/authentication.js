/**
 * GET /login
 * Login page
 */
exports.getLoginPage = (req, res) => {
  res.render('login', {title: 'Hey', message: 'Hello there!'})
};

/**
 * POST /login
 * Login user
 */
exports.login = (req, res) => {
  res.redirect(req.session.returnTo || '/campaigns')
  delete req.session.returnTo
};

/**
 * GET /logout
 * Logout user
 */
exports.logout = (req, res) => {
  req.logout()
  res.redirect('/login')
};

/**
 * Ensure authenticated
 */
exports.ensureAuthenticated = (req, res, next) => {
  req.session.returnTo = req.path
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
};