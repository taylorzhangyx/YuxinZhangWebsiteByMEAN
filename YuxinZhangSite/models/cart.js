var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product');

var Products = new Schema({
  product: {type: Schema.Types.ObjectId, ref: 'Product'},
  quantity: {type: Number},
  sumPrice: {type: Number}
});

var Cart = new Schema({
  products: [{type:Schema.Types.ObjectId, ref: 'Products'}],
  totalNum: {type: Number},
  totalPrice: {type: Number}
});

module.exports = mongoose.model('Cart', Cart);
