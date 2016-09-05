var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var TimestampSchema = mongoose.Schema({
    date: Date,
    location: String
})

module.exports = mongoose.model('Timestamp', TimestampSchema);