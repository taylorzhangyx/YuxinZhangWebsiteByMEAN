var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, done) { //done is a call back function(err, message)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use('local.signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid Email Address').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty().isLength({
    min: 6
  });
  var errors = req.validationErrors();
  if (errors) {
    var message = [];
    errors.forEach(function(error) {
      message.push(error.msg);
    });
    return done(null, false, req.flash('error', message));
  }


  User.findOne({
    'email': email
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, {
        message: 'Email is already in use.'
      });
    }
    var newUser = new User();
    newUser.email = email;
    console.log(hash);
    newUser.password = newUser.encryptPassword(password);
    newUser.cart = req.session.cart;
    newUser.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));

passport.use('local.signin', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid Email Address').notEmpty().isEmail();
  req.checkBody('password', 'Password Too Short').notEmpty().isLength({
    min: 6
  });
  var errors = req.validationErrors();
  if (errors) {
    var message = [];
    errors.forEach(function(error) {
      message.push(error.msg);
    });
    return done(null, false, req.flash('error', message));
  }

  User.findOne({
    'email': email
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'User not found.'
      });
    }
    if (!user.checkPassword(password)) {
      return done(null, false, {
        message: 'Incorrect Password'
      });
    }
    return done(null, user);
  });

}));
