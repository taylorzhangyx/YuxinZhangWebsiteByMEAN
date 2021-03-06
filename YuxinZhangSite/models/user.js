var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var Cart = require('./cart');

var User = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  signUpDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  }
});

const saltRounds = 10;

User.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, saltRounds);
}

User.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', User);
