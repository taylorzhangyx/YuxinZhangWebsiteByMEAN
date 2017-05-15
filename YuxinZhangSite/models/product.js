var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
  name: {
    type: String,
    required: true
  },
  category:{
    type: String,
    retuqired: true,
    default: 'new'
  },
  picture: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  soldnum: {
    type: Number,
    required: true,
    default: 0
  },
  seller: {
    type: String,
    required: true
  },
  postdate:{
    type: Date,
    default: Date.now
  },
  upvote:{
    type: Number,
    default: 0
  },
  downvote:{
    type: Number,
    default: 0
  }
});


module.exports = mongoose.model('Product', Product);
