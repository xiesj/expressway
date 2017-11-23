var mongoose = require('../db')
var schema = {
  id: {type: String, required: true, index: {unique: true}},
  name: {type: String, required: true},
  team: {type: String},
  age: {type: String},
  phone: {type: String},
  password: {type: String},
  role: {type: String},
  lastLogin: {type: Date, default: Date.now}
}

module.exports = mongoose.model('user', mongoose.Schema(schema))
