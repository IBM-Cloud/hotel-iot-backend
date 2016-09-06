var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Floor = require('./floor');

var HotelSchema = mongoose.Schema({
    name: String,
    location: String,
    icon: String,
    floors: [Floor.schema]
})

module.exports = mongoose.model('Hotel', HotelSchema);