var express = require('express');
var checkout = express.Router();
var Order = require('../../models/order');
var Carts = require('../../models/cart');
var Cart = Carts.Cart;
var Item = Carts.Item;

checkout.get('/', isLoggedIn, function(req, res, next) {
  Cart.findById(req.user.cart, function(err, cart){//find the cart
    if(!cart.totalQty){
      return res.redirect('/shop/cart');
    }
    else{
      var errMsg = req.flash('error')[0];
      res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
    }
  });
});

checkout.post('/', isLoggedIn, function(req, res, next) {

  Cart.findById(req.user.cart, function(err, cart){
    if(err) console.log(err);
    var stripe = require("stripe")(
        "sk_test_t19uBBH0EFIJnl01cnuQIags"
    );
    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        // if (err) {
        //     req.flash('error', err.message);
        //     return res.redirect('/checkout');
        // }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            // paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            cart.item.splice(0, cart.item.length);
            cart.totalPrice = 0;
            cart.totalQty = 0;
            cart.save();
            Item.find({cart: cart._id}, function(err, items){
              for(var item in items){
                items[item].remove();
              }
              res.redirect('/shop');
            })
        });
    });
  });

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


module.exports = checkout;
