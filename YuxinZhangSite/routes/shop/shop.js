var express = require('express');
var shop = express.Router();

/* GET users listing. */
shop.get('/', function(req, res, next) {
  res.render('./shop/shop');
});

module.exports = shop;
