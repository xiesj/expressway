const restify = require('restify')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const Router = require('restify-router').Router
const config = require('./config')
const mongoose = require('./db').mongoose

const router = new Router()

const server = restify.createServer({
  name: 'green-channel-api',
  version: '1.0.0'
})
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())
server.use(restify.CORS())
server.use(session({
  secret: 'PvkQecZr',
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

server.use(function (req, res, next) {
  res.charSet('utf-8')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'))
  res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'))
  return next()
})
server.opts(/.*/, function (req, res, next) {
  res.send(200)
  return next()
})

router.get('/', function (req, res, next) {
  res.end('OK')
})

router.get('/v1/', function (req, res, next) {
  res.end('v1 OK')
})

router.add('/v1/auth', require('./controllers/auth'))
router.add('/v1/users', require('./controllers/user'))
router.add('/v1/external', require('./controllers/external'))
router.add('/v1/internal', require('./controllers/internal'))

router.applyRoutes(server)

server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url)
})
