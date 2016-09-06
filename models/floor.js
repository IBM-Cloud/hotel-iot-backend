var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Room = require('./room');


var FloorSchema = mongoose.Schema({
    name: String,
    level: Number,
    rooms: [Room.schema]
})

module.exports = mongoose.model('Floor', FloorSchema);