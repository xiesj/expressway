const User = require('../models/user')
const Router = require('restify-router').Router
const router = new Router()

router.post('/login', function (req, res, next) {
  User.findOne({id: req.body.id})
    .then(function (result) {
      if (!result) {
        return res.send({
          'error': 'LOGIN_ACCOUNT_NOT_FOUND'
        })
      }
      if (result.password === req.body.password) {
        req.session.user = {
          id: result.id,
          name: result.name,
          age: result.age,
          phone: result.phone,
          role: result.role,
          lastLogin: result.lastLogin
        }
        return res.send({
          'user': req.session.user
        })
      } else {
        return res.send({
          'error': 'LOGIN_PASSWORD_NOT_MATCH'
        })
      }
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

module.exports = router
