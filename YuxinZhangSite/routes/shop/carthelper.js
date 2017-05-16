var Product = require('../../models/product');
var sessionCart = require('../../models/session-cart');
var helper = {};

//TODO
helper.addItemToCart = function( id,  req,  res){
  return 0;
}

helper.addItemToSession = function(id, req, res){
  var cart = new sessionCart(req.session.cart ? req.session.cart : {});

  Product.findById(req.params.id, function(err, product) {
     if (err) {
         return res.redirect('/');
     }
      cart.add(product, product.id);
      req.session.cart = cart;
      res.redirect('/shop');
  });
}

//TODO
helper.reduceItem = function(id, req, res){
  return 0;
}


helper.reduceItemSession = function(id, req, res){
    var cart = new sessionCart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(id);
    req.session.cart = cart;
    res.redirect('/shop/cart');
}

//TODO
helper.removeItem = function(id, req, res){
}


helper.removeItemSession = function(id, req, res){
  var cart = new sessionCart(req.session.cart ? req.session.cart : {});
  cart.removeItem(id);
  req.session.cart = cart;
  res.redirect('/shop/cart');
}


//TODO
helper.addItem = function(id, req, res){
}


helper.addItemSession = function(id, req, res){
  var cart = new sessionCart(req.session.cart ? req.session.cart : {});
  cart.addByOne(id);
  req.session.cart = cart;
  res.redirect('/shop/cart');
}

module.exports = helper;
