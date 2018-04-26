const mongoose = require('mongoose');

const AirlineSchema = mongoose.Schema({
    name: String,
    owner: String

});

module.exports = mongoose.model('airline', AirlineSchemas);