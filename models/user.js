const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password : String,
    role: String,
    created : Date

});

module.exports = mongoose.model('user', UserSchema);