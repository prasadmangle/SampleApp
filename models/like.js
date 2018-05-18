const mongoose = require('mongoose');

const LikeSchema = mongoose.Schema({
    productId : String,
    name: String
});

module.exports = mongoose.model('like', LikeSchema);