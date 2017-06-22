var mongoose = require('mongoose')
var config = require('./config')

mongoose.Promise = require('bluebird')

mongoose.connect(config.dbPath)
var db = mongoose.connection

db.on('error', function () {
  console.log('error occured from db')
})

db.once('open', function () {
  console.log('mongodb connected')
})

exports.mongoose = mongoose
