const User = require('../models/user')
const Auth = require('../services/auth')
const Router = require('restify-router').Router
const router = new Router()

router.use(Auth)

router.get('/list', function (req, res, next) {
  User.find({id: {$ne: 'admin'}}, '-password -__v')
    .then(function (result) {
      return res.send({
        'users': result
      })
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

router.get('/:id', function (req, res, next) {
  if (!req.params.id) {
    return res.send({
      'error': 'USER_WRONG_ID'
    })
  }
  User.findOne({id: req.params.id}, '-password -__v')
    .then(function (result) {
      if (result) {
        return res.send({
          'user': result
        })
      } else {
        return res.send({
          'error': 'USER_ID_NOT_FOUND'
        })
      }
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

router.del('/:_id', function (req, res, next) {
  console.log('delete user _id', req.params._id)
  if (!req.params._id) {
    return res.send({
      'error': 'DELETE_USER_DATA_ID_WRONG'
    })
  }
  User.remove({_id: req.params._id})
    .then(function (result) {
      return res.send(result)
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

router.post('/add', function (req, res, next) {
  var user = {
    id: req.body.id,
    name: req.body.name,
    team: req.body.team,
    age: req.body.age,
    phone: req.body.phone,
    password: req.body.password
  }
  if (!req.body.id) {
    return res.send({
      'error': 'ADD_USER_WRONG_ID'
    })
  }
  User.create(user)
    .then(function (result) {
      return res.send({
        'user': result
      })
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

router.put('/update', function (req, res, next) {
  if (!req.body._id) {
    return res.send({
      'error': 'UPDATE_USER_DATA_ID_WRONG'
    })
  }
  if (!req.body.id) {
    return res.send({
      'error': 'UPDATE_USER_ID_WRONG'
    })
  }
  var findQuery = {
    _id: req.body._id
  }
  User.findOne(findQuery)
    .then(function (result) {
      if (!result) {
        return res.send({
          'error': 'UPDATE_USER_DATA_ID_NOT_FOUND'
        })
      }
      var updateQuery = {
        id: req.body.id,
        team: req.body.team,
        name: req.body.name,
        age: req.body.age,
        phone: req.body.phone
      }
      if (req.body.password) {
        updateQuery.password = req.body.password
      }
      return User.update(findQuery, { $set: updateQuery })
    })
    .then(function (result) {
      return res.send(result)
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

module.exports = router
