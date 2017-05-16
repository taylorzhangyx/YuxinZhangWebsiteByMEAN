var express = require('express');
var shop = express.Router();
var passport = require('passport');
var csrf = require('csurf');
var carthelper = require('./carthelper');

var csrfProtection = csrf();
shop.use(csrfProtection);

//schema
var Product = require('../../models/product');

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
        res.render('shop/shop', {
          products: productChunks,
          msg: successmsg
        });
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

shop.get('/add-to-cart/:id', function(req, res, next){
  if(req.isAuthenticated()){
    carthelper.addItemToCart(req.params.id, req, res);
  }
  else{
    carthelper.addItemToSession(req.params.id, req, res);
  }
});

shop.get('/cart', function(req, res, next){
  res.render('shop/cart');
});


shop.get('/profile', isLoggedIn, function(req, res, next){
  res.render('shop/profile');
});

shop.get('/logout', function(req, res, next){
  req.logout();
  res.render('shop/logout');
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('./signup');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = shop;
