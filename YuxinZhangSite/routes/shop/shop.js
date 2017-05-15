var express = require('express');
var shop = express.Router();


//schema
var Product = require('../../models/product');

/* GET users listing. */
shop.get('/', function(req, res, next) {
  var successmsg = req.flash('success')[0];
  Product.find({}).then(
    function(product) {
      console.log(product);
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
    console.log();
  });
});

module.exports = shop;
