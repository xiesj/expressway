module.exports = function (req, res, next) {
  if (req.session.user) {
    return next()
  } else {
    return res.send({
      'error': 'LOGIN_REQUIRED'
    })
  }
}
