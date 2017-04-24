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
  res.redirect('/campaigns')
};

/**
 * GET /logout
 * Logout user
 */
exports.logout = (req, res) => {
  req.logout()
  res.redirect('/login')
};