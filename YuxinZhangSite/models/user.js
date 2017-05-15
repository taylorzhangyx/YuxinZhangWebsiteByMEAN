var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var User = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  signUpDate: {type: Date, default: Date.now},
  lastLogin: {type: Date, default: Date.now},
  Address: {type: String},
});

const saltRounds = 10;

User.methods.encryptPassword = function(password){
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(error, hash) {
        // Store hash in your password DB.
        return hash;
    });
});
}

User.methods.checkPassword = function(password){
  bcrypt.compare(password, this.password, function(err, res){
    return res;
  });
}

module.exports = mongoose.model('User', User);
