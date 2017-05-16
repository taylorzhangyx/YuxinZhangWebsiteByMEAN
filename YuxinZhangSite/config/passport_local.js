var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;

var sessionCart = require('../models/session-cart');
var Carts = require('../models/cart');
var Cart = Carts.Cart;
var Item = Carts.Item;

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
  //handel duplicate name
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
    //get new cart
    var cart = new Cart();
    //get new user
    var newUser = new User();
    //process cart
    if(req.session.cart){
      var seCart = new sessionCart(req.session.cart);

      cart.totalQty = seCart.totalQty;
      cart.totalPrice = seCart.totalPrice;
      cart.user = newUser._id;
      for(var id in seCart.item){
        var commodity = seCart.item[id];
        var newproducts = new Item({
          product: commodity.product._id,
          quantity: commodity.quantity,
          sumPrice: commodity.sumPrice,
          cart: cart._id
        });
        newproducts.save(function(err, result){
          if(err) console.log('newproduct save ' + err);
        });
        cart.item.push(newproducts._id);
      }
      req.session.cart = null;
    }
    cart.save(function(err, result){
      if(err) console.log("cart save Error: " + err);
    });
    //process user
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.cart = cart._id;
    newUser.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));


/*sign in handle*/
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
  }).populate('cart')
  .exec(function(err, user) {
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

    //handel cart


    var cart = user.cart;
    console.log(cart);
    //process cart
    if(req.session.cart){
      var seCart = new sessionCart(req.session.cart);

      cart.totalQty = add(cart.totalQty, seCart.totalQty);
      cart.totalPrice = add(cart.totalPrice, seCart.totalPrice);

      for(var id in seCart.item){
        var commodity = seCart.item[id];
        var newproducts = new Item({
          product: commodity.product._id,
          quantity: commodity.quantity,
          sumPrice: commodity.sumPrice,
          cart: cart._id
        });
        newproducts.save(function(err, result){
          if(err) console.log('newproduct save ' + err);
        });
        cart.item.push(newproducts._id);
      }

      req.session.cart = null;
    }
    cart.save(function(err, result){
      if(err) console.log("cart save Error: " + err);
    });

    return done(null, user);
  });

}));


function add(a,b){
  return (a*100 + b*100)/100;
}
