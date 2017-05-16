var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product');

var Item = new Schema({
  product: {type: Schema.Types.ObjectId, ref: 'Product'},
  quantity: {type: Number, default: 0},
  sumPrice: {type: Number, default: 0, get: getPrice, set: setPrice},
  cart:  {type: Schema.Types.ObjectId, ref: 'Cart'}
});

var Cart = new Schema({
  item: [{type: Schema.Types.ObjectId, ref: 'Item'}],
  totalQty: {type: Number, default: 0},
  totalPrice: {type: Number, default: 0, get: getPrice, set: setPrice},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}

module.exports.Cart = mongoose.model('Cart', Cart);
module.exports.Item = mongoose.model('Item', Item);
