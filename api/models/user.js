module.exports = (function () {
  var mongoose = require('../db').mongoose
  var schema = {
    id: {type: String, required: true, index: {unique: true}},
    name: {type: String, required: true},
    age: {type: String},
    phone: {type: String},
    password: {type: String},
    role: {type: String},
    lastLogin: {type: Date, default: Date.now}
  }
  return mongoose.model('user', mongoose.Schema(schema))
})()
