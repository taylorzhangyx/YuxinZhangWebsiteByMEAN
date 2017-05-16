var Product = require('../../models/product');
var sessionCart = require('../../models/session-cart');
var User = require('../../models/user');

var Carts = require('../../models/cart');
var Cart = Carts.Cart;
var Item = Carts.Item;

var helper = {};

helper.addItemToCart = function( id,  req,  res){
  Cart.findById(req.user.cart, function(err, cart){
    if(err) console.log(err);

    Item.findOne({//find if added in
      cart: cart._id,
      product: id
    }).populate('product')
    .exec(function(err, commodity){
      if(err) console.log(err);
      if(commodity){
        console.log(commodity);
        //in cart
        commodity.quantity++;
        commodity.sumPrice = add(commodity.sumPrice, commodity.product.price);
        commodity.save(function(err, result){
          if(err) console.log(err);
          cart.totalQty ++;
          cart.totalPrice = add(cart.totalPrice, commodity.product.price);
          cart.save(function(err, resu){
            res.redirect('/shop/cart');
          });
        })
      }
      else{
        //not in cart
        var newcommodity = new Item({
          product: id,
          cart: cart._id
        });
        newcommodity.quantity++;

        //find the product to add
        Product.findById(id, function(err, product) {
           if (err) {
               return res.redirect('/');
           }
          newcommodity.sumPrice = add(newcommodity.sumPrice, product.price);
          newcommodity.save(function(err, result){
            cart.item.push(newcommodity._id);
            cart.totalQty++;
            cart.totalPrice = add(cart.totalPrice, product.price);

            cart.save(function(err, resul){
              if(err) console.log(err);
              res.redirect('/shop/cart');
            });
          });
        });
      }
    });
  });
}

helper.addItemToSession = function(id, req, res){
  var cart = new sessionCart(req.session.cart ? req.session.cart : {});

  Product.findById(id, function(err, product) {
     if (err) {
         return res.redirect('/');
     }
      cart.add(product, product.id);
      req.session.cart = cart;
      res.redirect('/shop/cart');
  });
}

helper.reduceItem = function(id, req, res){
  Cart.findById(req.user.cart,function(err, cart){
    if(err) console.log(err);
    Item.findOne({
      product: id,
      cart: cart._id
    })
    .populate('product')
    .exec(function(err, item){
      item.quantity--;
      if(item.quantity <= 0){
          res.redirect('/shop/remove/'+id);
      }
      else{
        item.sumPrice = minus(item.sumPrice, item.product.price);
        item.save();
        cart.totalQty--;
        cart.totalPrice = minus(cart.totalPrice, item.product.price);
        cart.save(function(err, result){
          res.redirect('/shop/cart');
        });
      }
    });
  });
}


helper.reduceItemSession = function(id, req, res){
    var cart = new sessionCart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(id);
    if(cart.totalQty === 0){
      req.session.cart = null;
    }
    else{
    req.session.cart = cart;
    }
    res.redirect('/shop/cart');
}

helper.removeItem = function(id, req, res){
  Cart.findById(req.user.cart, function(err, cart){
    Item.findOne({
      product: id,
      cart: cart._id
    }, function(err, item){
      cart.totalQty -= item.quantity;
      cart.totalPrice = minus(cart.totalPrice, item.sumPrice);
      cart.item.splice(cart.item.indexOf(item._id), 1);
      item.remove();
      cart.save(function(err, result){
        res.redirect('/shop/cart');
      });
    });
  });
}

helper.removeItemSession = function(id, req, res){
  var cart = new sessionCart(req.session.cart ? req.session.cart : {});
  cart.removeItem(id);
  if(cart.totalQty === 0){
    req.session.cart = null;
  }
  else{
  req.session.cart = cart;
  }
  res.redirect('/shop/cart');
}

function add(a, b){
  return (a*100 + b*100)/100;
}

function minus(a, b){
  return (a*100 - b*100)/100;
}

module.exports = helper;
