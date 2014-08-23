// Use this middleware to require that a user is logged in
module.exports = function(req, res, next) {
  if (Parse.User.current()) {
    next();
  } else {
    res.redirect('/login');
  }
}
