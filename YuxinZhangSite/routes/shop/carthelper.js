var Product = require('../../models/product');
var sessionCart = require('../../models/session-cart');
var helper = {};
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
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      console.log(req.session.cart);
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      res.redirect('/shop');
  });
}

module.exports = helper;
