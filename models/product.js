const mongoose = require('mongoose'), Schema = mongoose.Schema;

var Comment = new Schema({
    body  : String
  , date  : { type: Date, default: Date.now}
});

const ProductSchema = mongoose.Schema({
    name: String,
    comments : [Comment],
    starsCount : { type: Number, default: 5}
});

module.exports = mongoose.model('product', ProductSchema);