const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('product', ProductSchema);