var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product');

var Products = new Schema({
  product: {type: Schema.Types.ObjectId, ref: 'Product'},
  quantity: {type: Number, default: 0},
  sumPrice: {type: Number, default: 0}
});

var Cart = new Schema({
  products: [{type:Schema.Types.ObjectId, ref: 'Products'}],
  totalNum: {type: Number, default: 0},
  totalPrice: {type: Number, default: 0},
});

module.exports.Cart = mongoose.model('Cart', Cart);
