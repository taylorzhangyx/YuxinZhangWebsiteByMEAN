var express = require('express');
var path = require('path');
var shop = express.Router();
var passport = require('passport');
var csrf = require('csurf');
var carthelper = require('./carthelper');


var csrfProtection = csrf();
shop.use(csrfProtection);

//schema
var Product = require('../../models/product');
var Carts = require('../../models/cart');
var Cart = Carts.Cart;
var Item = Carts.Item;

/* GET users listing. */
shop.get('/', function(req, res, next) {
  var successmsg = req.flash('success')[0];
  Product.find({}).then(
    function(product) {
      if(product){
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < product.length; i += chunkSize) {
          productChunks.push(product.slice(i, i + chunkSize));
        }
        if(req.isAuthenticated()){
          Cart.findById(req.user.cart, function(err, cart){
            res.render('shop/shop', {
              products: productChunks,
              msg: successmsg,
              cart: cart
            });
          });
        }
        else{
          res.render('shop/shop', {
            products: productChunks,
            msg: successmsg,
            cart: req.session.cart
          });
        }

      }
      else res.redirect('/');
    }
  ).catch(function(err){
    console.log(err);
  });
});





shop.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('shop/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});


shop.post('/signin',passport.authenticate('local.signin', {
  failureRedirect:'/shop/signin',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }
  else{
    res.redirect('/shop/profile');
  }
});


shop.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('shop/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});


shop.post('/signup',passport.authenticate('local.signup', {
  failureRedirect:'/shop/signup',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }
  else{
    res.redirect('/shop/profile');
  }
});

shop.get('/reduce/:id', function(req, res, next) {
  if(req.isAuthenticated()){
    carthelper.reduceItem(req.params.id, req, res);
  }
  else{
    carthelper.reduceItemSession(req.params.id, req, res);
  }
});

shop.get('/remove/:id', function(req, res, next) {
  if(req.isAuthenticated()){
    carthelper.removeItem(req.params.id, req, res);
  }
  else{
    carthelper.removeItemSession(req.params.id, req, res);
  }
});



shop.get('/add-to-cart/:id', function(req, res, next){
  if(req.isAuthenticated()){
    carthelper.addItemToCart(req.params.id, req, res);
  }
  else{
    carthelper.addItemToSession(req.params.id, req, res);
  }
});


shop.get('/cart', function(req, res, next){
  //if log in
  if(req.isAuthenticated()){
    Cart.findById(req.user.cart)
    .populate({
      path: 'item',
      populate:{path: 'product'}
    })
    .exec(function(err, dbcart){
      if(err) console.log(err);
      res.render('shop/cart', {'cart': dbcart});
    });
  }
  //if not login
  else{
    res.render('shop/cart', {'cart': req.session.cart});
  }

});


shop.get('/profile', isLoggedIn, function(req, res, next){
  res.render('shop/profile');
});

shop.get('/addproduct', isLoggedIn, function(req, res, next){
  res.render('shop/addproduct',  {csrfToken: req.csrfToken()});
});


shop.post('/addproduct', isLoggedIn, function(req, res, next){
  console.log(req.body);
  var data = req.body;
  var newproduct = new Product({
    name: data.name,
    category: data.category,
    picture: data.picture,
    description: data.description,
    price: data.price,
    seller: req.user.email
  });
  newproduct.save(function(err, result){
    if(err) console.log(err);
    res.redirect('/shop/product/' + newproduct._id);
  });
});

shop.get('/product/:id', function(req, res, next){
  Product.findById(req.params.id, function(err, product){
    if(err) console.log(err);
    res.render('shop/product', {product: product});
  });
});

shop.get('/logout', function(req, res, next){
  req.session.cart = null;
  req.logout();
  res.render('shop/logout');
});




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log(req.url);
    req.session.oldUrl = "/shop" + req.url;

    console.log('old: ' + req.session.oldUrl);

    res.redirect('/shop/signin');
}


shop.get('/:category', function(req, res, next) {
  var successmsg = req.flash('success')[0];
  Product.find({category: req.params.category}).then(
    function(product) {
      if(product){
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < product.length; i += chunkSize) {
          productChunks.push(product.slice(i, i + chunkSize));
        }
        if(req.isAuthenticated()){
          Cart.findById(req.user.cart, function(err, cart){
            res.render('shop/shop', {
              products: productChunks,
              msg: successmsg,
              cart: cart
            });
          });
        }
        else{
          res.render('shop/shop', {
            products: productChunks,
            msg: successmsg,
            cart: req.session.cart
          });
        }

      }
      else res.redirect('/');
    }
  ).catch(function(err){
    console.log(err);
  });
})


module.exports = shop;
